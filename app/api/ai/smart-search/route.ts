import { NextRequest, NextResponse } from 'next/server';

interface SmartSearchRequest {
  query: string;
}

export async function POST(req: NextRequest) {
  try {
    const { query } = (await req.json()) as SmartSearchRequest;
    if (!query || !query.trim()) {
      return NextResponse.json({
        success: true,
        filters: {
          category: 'All',
          dietary: { vegetarian: false, vegan: false, halal: false, glutenFree: false },
          maxPrice: 50000,
          timing: 'ALL',
          maxDistanceKm: 10,
          keywords: '',
          explanation: 'Showing all active surplus drops across Kigali.',
        },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const prompt = `You are FreshFind's AI Search Natural Language Parser for a food rescue marketplace in Kigali, Rwanda.
Parse this user search query: "${query}"
Convert into structured filters.
Output ONLY JSON matching:
{
  "category": "All" | "Bakery" | "Supermarket" | "Restaurant" | "Hotel" | "Cafe",
  "dietary": {
    "vegetarian": boolean,
    "vegan": boolean,
    "halal": boolean,
    "glutenFree": boolean
  },
  "maxPrice": number (default 50000 if not specified),
  "timing": "TODAY" | "TOMORROW" | "ALL",
  "maxDistanceKm": number (default 10 if not specified),
  "keywords": string (cleaned keyword search terms),
  "explanation": string (1-sentence user-friendly summary of what was parsed)
}`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              response_mime_type: 'application/json',
              temperature: 0.1,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return NextResponse.json({ success: true, source: 'LIVE_GEMINI_SEARCH', filters: parsed });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini Search API fallback triggered:', geminiErr);
      }
    }

    // Heuristic natural language regex parser ($0 offline fallback)
    const lower = query.toLowerCase();
    const isVegan = lower.includes('vegan') || lower.includes('plant based');
    const isVegetarian = isVegan || lower.includes('veg') || lower.includes('vegetarian') || lower.includes('meat free');
    const isHalal = lower.includes('halal');
    const isGlutenFree = lower.includes('gluten free') || lower.includes('celiac');

    let category = 'All';
    if (lower.includes('bakery') || lower.includes('bread') || lower.includes('croissant') || lower.includes('pastry')) category = 'Bakery';
    else if (lower.includes('cafe') || lower.includes('coffee') || lower.includes('sandwich')) category = 'Cafe';
    else if (lower.includes('supermarket') || lower.includes('grocery') || lower.includes('fruit') || lower.includes('produce')) category = 'Supermarket';
    else if (lower.includes('hotel') || lower.includes('buffet') || lower.includes('banquet')) category = 'Hotel';
    else if (lower.includes('restaurant') || lower.includes('dinner') || lower.includes('lunch') || lower.includes('meal')) category = 'Restaurant';

    let timing: 'TODAY' | 'TOMORROW' | 'ALL' = 'ALL';
    if (lower.includes('today') || lower.includes('tonight') || lower.includes('now')) timing = 'TODAY';
    else if (lower.includes('tomorrow') || lower.includes('morning')) timing = 'TOMORROW';

    // Extract price e.g. "under 5000", "< 6k", "5k", "8000 rwf"
    let maxPrice = 50000;
    const priceMatch = lower.match(/(?:under|<|below|max|budget of)?\s*(\d+)(?:k|000)?\s*(?:rwf|frw)?/i);
    if (priceMatch) {
      let val = parseInt(priceMatch[1], 10);
      if (lower.includes(`${val}k`)) val = val * 1000;
      if (val > 500) maxPrice = val;
    }

    let explanation = `Filtered by ${category !== 'All' ? category : 'all categories'}${isVegetarian ? ', Vegetarian' : ''}${isHalal ? ', Halal' : ''}${maxPrice < 50000 ? ` under ${maxPrice.toLocaleString()} RWF` : ''}${timing !== 'ALL' ? ` for pickup ${timing.toLowerCase()}` : ''}.`;

    return NextResponse.json({
      success: true,
      source: 'SMART_HEURISTIC_PARSER',
      filters: {
        category,
        dietary: { vegetarian: isVegetarian, vegan: isVegan, halal: isHalal, glutenFree: isGlutenFree },
        maxPrice,
        timing,
        maxDistanceKm: 10,
        keywords: query.replace(/under|cheap|today|tomorrow|vegan|halal|rwf/gi, '').trim(),
        explanation,
      },
    });
  } catch (error) {
    console.error('Smart search error:', error);
    return NextResponse.json({ success: false, error: 'Failed to parse search query' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

interface ChefRecipeRequest {
  items: string[];
  bagTitle?: string;
  mealType?: 'DINNER' | 'BREAKFAST' | 'DESSERT' | 'SNACK' | 'ANY';
  timeConstraintMin?: number;
  dietaryFilter?: {
    vegetarian?: boolean;
    vegan?: boolean;
    halal?: boolean;
    glutenFree?: boolean;
  };
}

const FALLBACK_RECIPES = [
  {
    id: 'rec-1',
    title: 'Artisan French Toast & Caramelized Banana Casserole',
    mealType: 'BREAKFAST',
    prepTime: '15 mins',
    cookTime: '15 mins',
    difficulty: 'Easy',
    servings: 3,
    heroItem: 'Day-Old Croissants & Brioche',
    chefRevivalSecret: 'Drizzle 1 tbsp of milk or cream over slightly dry croissants before baking. The steam fluffs up the interior while butter caramelizes the crust to bakery perfection!',
    ingredients: [
      '3 day-old croissants or brioche (torn into bite-sized chunks)',
      '2 eggs (beaten)',
      '1/2 cup milk or oat milk',
      '1 tbsp sugar or honey',
      '1 ripe banana or fruit slices',
      '1/2 tsp cinnamon powder',
      'Pinch of sea salt',
    ],
    steps: [
      'Preheat your oven or air fryer to 180°C (350°F). Lightly grease a small baking dish.',
      'In a bowl, whisk eggs, milk, cinnamon, sugar, and a pinch of salt until smooth.',
      'Toss the torn croissant pieces and sliced banana into the egg mixture until soaked.',
      'Transfer to the baking dish and bake for 12–15 minutes until golden and bubbling on top.',
      'Dust with powdered sugar or drizzle with honey. Serve warm!',
    ],
    ecoSaving: 'Saves 350g of bakery surplus and prevents 850g CO₂ emissions.',
  },
  {
    id: 'rec-2',
    title: 'Crispy Garlic Crouton & Warm Harvest Salad Bowl',
    mealType: 'DINNER',
    prepTime: '12 mins',
    cookTime: '8 mins',
    difficulty: 'Easy',
    servings: 2,
    heroItem: 'Artisan Sourdough Baguette',
    chefRevivalSecret: 'Toss dry sourdough cubes with olive oil and crushed garlic in a hot skillet for 4 minutes—they turn into golden, crunchy restaurant-grade croutons!',
    ingredients: [
      '1/2 loaf sourdough baguette (cubed)',
      '2 tbsp olive oil or butter',
      '2 cloves garlic (minced)',
      'Rescued salad greens or mixed vegetables',
      '1/4 cup shredded cheese or Greek yogurt dressing',
      'Black pepper and dried oregano to taste',
    ],
    steps: [
      'Heat olive oil and minced garlic in a non-stick skillet over medium-high heat.',
      'Add cubed sourdough and toss continuously for 5–7 minutes until deep golden and crunchy.',
      'In a large bowl, wash and dry your fresh rescued greens.',
      'Top the greens with the warm garlic sourdough croutons, dressing, and cheese.',
      'Enjoy a restaurant-quality warm salad with zero food waste!',
    ],
    ecoSaving: 'Revives stale bread into a fresh gourmet lunch in under 15 minutes.',
  },
  {
    id: 'rec-3',
    title: 'Spiced Coconut Tilapia & Crispy Rice Stir-Fry',
    mealType: 'DINNER',
    prepTime: '10 mins',
    cookTime: '10 mins',
    difficulty: 'Easy',
    servings: 2,
    heroItem: 'Rescued Hotel Buffet Fish & Rice',
    chefRevivalSecret: 'Reheat pre-cooked fish on high heat with a squeeze of fresh lime juice and coconut cream to restore juiciness and lock in flavors.',
    ingredients: [
      'Rescued grilled tilapia or fish fillet (flaked)',
      '1.5 cups pre-cooked spiced pilau or white rice',
      '1 tbsp cooking oil',
      '1 small onion & green chili (sliced)',
      '2 tbsp coconut milk or soy sauce',
      'Fresh lime wedge and coriander',
    ],
    steps: [
      'Heat oil in a wok or deep skillet on high heat. Add sliced onions and chili until fragrant.',
      'Add the pre-cooked rice and toss vigorously for 3 minutes until steaming hot and slightly crispy.',
      'Gently fold in the flaked fish and coconut milk, stirring gently so the fish stays tender.',
      'Remove from heat, squeeze fresh lime juice on top, and garnish with herbs.',
    ],
    ecoSaving: 'Transforms hotel banquet surplus into an exquisite quick evening dinner.',
  },
];

export async function POST(req: NextRequest) {
  try {
    const body: ChefRecipeRequest = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && body.items && body.items.length > 0) {
      try {
        const prompt = `You are Chef Rescue, FreshFind's zero-waste culinary expert in Kigali, Rwanda.
Given these rescued surplus ingredients: ${body.items.join(', ')}
Bag Title: ${body.bagTitle || 'Mystery Food Bag'}
Meal preference: ${body.mealType || 'ANY'}
Maximum time: ${body.timeConstraintMin || 25} minutes

Generate 2 creative, delicious, easy zero-waste recipes that revive and transform these ingredients.
Output ONLY a valid JSON array matching this format:
[
  {
    "id": string,
    "title": string,
    "mealType": "BREAKFAST" | "DINNER" | "DESSERT" | "SNACK",
    "prepTime": string,
    "cookTime": string,
    "difficulty": "Easy" | "Medium",
    "servings": number,
    "heroItem": string,
    "chefRevivalSecret": string (practical reheating or texture revival trick),
    "ingredients": string[],
    "steps": string[],
    "ecoSaving": string
  }
]`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              response_mime_type: 'application/json',
              temperature: 0.3,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return NextResponse.json({ success: true, source: 'LIVE_GEMINI_CHEF', recipes: parsed });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini Chef API fallback triggered:', geminiErr);
      }
    }

    return NextResponse.json({
      success: true,
      source: 'SMART_CHEF_ENGINE',
      recipes: FALLBACK_RECIPES,
    });
  } catch (error) {
    console.error('Chef recipe error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate recipes' }, { status: 500 });
  }
}

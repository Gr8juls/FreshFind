import { POST as handleSmartSearch } from '../app/api/ai/smart-search/route';
import { POST as handleChefRecipe } from '../app/api/ai/chef-recipe/route';
import { POST as handleVisionScan } from '../app/api/ai/vision-scan/route';
import { POST as handleVendorCopilot } from '../app/api/ai/vendor-copilot/route';
import { NextRequest } from 'next/server';

function createMockRequest(body: any): NextRequest {
  return new NextRequest('http://localhost:3000/api/ai/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('FreshFind AI API Routes Integration Tests', () => {
  describe('POST /api/ai/smart-search', () => {
    it('parses natural language query into structured filters', async () => {
      const req = createMockRequest({ query: 'vegan dinner under 5000 rwf tonight' });
      const res = await handleSmartSearch(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.filters).toBeDefined();
      expect(json.filters.dietary.vegan).toBe(true);
      expect(json.filters.maxPrice).toBeLessThanOrEqual(5000);
      expect(json.filters.timing).toBe('TODAY');
    });

    it('handles empty query gracefully with default discovery filters', async () => {
      const req = createMockRequest({ query: '' });
      const res = await handleSmartSearch(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.filters.category).toBe('All');
    });
  });

  describe('POST /api/ai/chef-recipe', () => {
    it('generates zero-waste recipes with revival techniques', async () => {
      const req = createMockRequest({
        items: ['Croissant', 'Brioche', 'Bananas'],
        bagTitle: 'Artisan Pastry Box',
        mealType: 'BREAKFAST',
      });
      const res = await handleChefRecipe(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(Array.isArray(json.recipes)).toBe(true);
      expect(json.recipes.length).toBeGreaterThan(0);

      const firstRecipe = json.recipes[0];
      expect(firstRecipe.title).toBeDefined();
      expect(firstRecipe.chefRevivalSecret).toBeDefined();
      expect(firstRecipe.ingredients.length).toBeGreaterThan(0);
      expect(firstRecipe.steps.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/ai/vision-scan', () => {
    it('analyzes bakery surplus sample with allergen detection', async () => {
      const req = createMockRequest({ presetType: 'BAKERY' });
      const res = await handleVisionScan(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data).toBeDefined();
      expect(json.data.category).toBe('Bakery');
      expect(json.data.detectedItems.length).toBeGreaterThan(0);
      expect(json.data.discountedPrice).toBeLessThan(json.data.originalPrice);
    });

    it('analyzes hotel buffet surplus with halal & gluten-free tags', async () => {
      const req = createMockRequest({ presetType: 'BUFFET' });
      const res = await handleVisionScan(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.bagType).toBe('Buffet Feast Box');
      expect(json.data.isHalal).toBe(true);
    });
  });

  describe('POST /api/ai/vendor-copilot', () => {
    it('calculates dynamic markdown optimization and kitchen operational alerts', async () => {
      const req = createMockRequest({
        businessName: 'Kigali Artisan Bakery',
        category: 'Bakery',
        activeOffers: [
          {
            id: 'off-1',
            title: 'Surprise Artisan Pastry Box',
            originalPrice: 15000,
            discountedPrice: 4500,
            quantityAvailable: 4,
            pickupEnd: '19:30',
          },
        ],
      });
      const res = await handleVendorCopilot(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.totalSurplusBags).toBe(4);
      expect(json.data.recommendations.length).toBe(1);
      expect(json.data.recommendations[0].sellOutProbWithMarkdown).toBeGreaterThan(90);
      expect(json.data.smartAlerts.length).toBeGreaterThan(0);
    });
  });
});

/**
 * DuoCal Cloudflare Worker
 * 
 * This Worker coordinates the AI-powered meal logging:
 * 1. Receives natural language meal descriptions from the frontend
 * 2. Uses Workers AI (Llama 3.3) to parse and calculate calories
 * 3. Stores meal data in Durable Objects for state persistence
 * 4. Returns daily totals and meal history
 */

export interface Env {
  // Durable Object binding
  CALORIE_LOG: DurableObjectNamespace<CalorieLog>;
  
  // Workers AI binding (automatically available in Workers AI)
  AI: any;
}

// Request/Response types
interface MealRequest {
  userId: string;
  mealDescription: string;
}

interface MealResponse {
  meal_name: string;
  estimated_calories: number;
  macronutrients?: {
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

interface DailyTotal {
  total_calories: number;
  meals: Array<{
    meal_name: string;
    estimated_calories: number;
    logged_at: string;
  }>;
}

/**
 * Main Worker handler
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route: POST /api/log-meal - Log a new meal using AI
      if (path === '/api/log-meal' && request.method === 'POST') {
        const body: MealRequest = await request.json();
        const { userId, mealDescription } = body;

        if (!userId || !mealDescription) {
          return new Response(
            JSON.stringify({ error: 'userId and mealDescription are required' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Step 1: Use Workers AI to parse the meal description
        const aiResponse = await parseMealWithAI(env, mealDescription);

        // Step 2: Store in Durable Object
        const durableObjectId = env.CALORIE_LOG.idFromName(userId);
        const durableObject = env.CALORIE_LOG.get(durableObjectId);
        
        const storeResponse = await durableObject.fetch(
          new Request('http://duocal.internal/store', {
            method: 'POST',
            body: JSON.stringify({
              meal_name: aiResponse.meal_name,
              estimated_calories: aiResponse.estimated_calories,
              macronutrients: aiResponse.macronutrients,
            }),
          })
        );

        const stored = await storeResponse.json();

        // Step 3: Get updated daily total
        const totalResponse = await durableObject.fetch(
          new Request('http://duocal.internal/total', { method: 'GET' })
        );
        const dailyTotal: DailyTotal = await totalResponse.json();

        return new Response(
          JSON.stringify({
            success: true,
            meal: aiResponse,
            daily_total: dailyTotal.total_calories,
            message: 'Meal logged successfully',
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Route: GET /api/daily-total/:userId - Get daily calorie total
      if (path.startsWith('/api/daily-total/') && request.method === 'GET') {
        const userId = path.split('/').pop();
        
        if (!userId) {
          return new Response(
            JSON.stringify({ error: 'userId is required' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        const durableObjectId = env.CALORIE_LOG.idFromName(userId);
        const durableObject = env.CALORIE_LOG.get(durableObjectId);
        
        const totalResponse = await durableObject.fetch(
          new Request('http://duocal.internal/total', { method: 'GET' })
        );
        const dailyTotal: DailyTotal = await totalResponse.json();

        return new Response(
          JSON.stringify(dailyTotal),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Route: GET /api/meals/:userId - Get all meals for today
      if (path.startsWith('/api/meals/') && request.method === 'GET') {
        const userId = path.split('/').pop();
        
        if (!userId) {
          return new Response(
            JSON.stringify({ error: 'userId is required' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        const durableObjectId = env.CALORIE_LOG.idFromName(userId);
        const durableObject = env.CALORIE_LOG.get(durableObjectId);
        
        const mealsResponse = await durableObject.fetch(
          new Request('http://duocal.internal/meals', { method: 'GET' })
        );
        const meals = await mealsResponse.json();

        return new Response(
          JSON.stringify(meals),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Health check
      if (path === '/' || path === '/health') {
        return new Response(
          JSON.stringify({ 
            message: 'DuoCal AI Worker is running!',
            endpoints: [
              'POST /api/log-meal',
              'GET /api/daily-total/:userId',
              'GET /api/meals/:userId',
            ]
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response('Not Found', { 
        status: 404,
        headers: corsHeaders 
      });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  },
};

/**
 * Use Workers AI (Llama 3.3) to parse meal description and calculate calories
 */
async function parseMealWithAI(env: Env, mealDescription: string): Promise<MealResponse> {
  const prompt = `You are an expert nutritionist. Analyze the following meal description and return ONLY a valid JSON object with the following structure:
{
  "meal_name": "A descriptive name of the meal",
  "estimated_calories": <number>,
  "macronutrients": {
    "protein": <number in grams>,
    "carbs": <number in grams>,
    "fat": <number in grams>
  }
}

Meal description: "${mealDescription}"

Return ONLY the JSON object, no additional text or explanation.`;

  try {
    // Call Workers AI with Llama 3.3
    const response = await env.AI.run('@cf/meta/llama-3.3-8b-instruct', {
      messages: [
        {
          role: 'system',
          content: 'You are a nutrition expert. Always respond with valid JSON only, no markdown formatting.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.3, // Lower temperature for more consistent results
    });

    // Extract JSON from response
    // Workers AI returns { response: string } or the response directly
    let responseText = '';
    if (response && typeof response === 'object') {
      if ('response' in response && typeof response.response === 'string') {
        responseText = response.response;
      } else if ('text' in response && typeof response.text === 'string') {
        responseText = response.text;
      } else {
        responseText = JSON.stringify(response);
      }
    } else if (typeof response === 'string') {
      responseText = response;
    } else {
      responseText = String(response);
    }

    // Clean up the response - remove markdown code blocks if present
    responseText = responseText.trim();
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (responseText.startsWith('```')) {
      responseText = responseText.replace(/```\n?/g, '');
    }

    // Parse JSON
    const parsed: MealResponse = JSON.parse(responseText);

    // Validate required fields
    if (!parsed.meal_name || typeof parsed.estimated_calories !== 'number') {
      throw new Error('Invalid AI response format');
    }

    // Ensure calories is a positive number
    parsed.estimated_calories = Math.max(0, Math.round(parsed.estimated_calories));

    return parsed;
  } catch (error) {
    console.error('AI parsing error:', error);
    
    // Fallback: Simple estimation if AI fails
    const words = mealDescription.toLowerCase().split(/\s+/);
    const calorieKeywords: { [key: string]: number } = {
      'sandwich': 300,
      'salad': 150,
      'pizza': 250,
      'burger': 500,
      'chicken': 200,
      'rice': 200,
      'pasta': 300,
      'coffee': 5,
      'oatmeal': 150,
      'blueberries': 50,
    };

    let estimatedCalories = 300; // Default
    for (const word of words) {
      if (calorieKeywords[word]) {
        estimatedCalories += calorieKeywords[word];
      }
    }

    return {
      meal_name: mealDescription,
      estimated_calories: estimatedCalories,
      macronutrients: {
        protein: Math.round(estimatedCalories * 0.2 / 4), // Rough estimate
        carbs: Math.round(estimatedCalories * 0.5 / 4),
        fat: Math.round(estimatedCalories * 0.3 / 9),
      },
    };
  }
}

/**
 * Durable Object class for storing meal state
 */
export class CalorieLog {
  state: DurableObjectState;
  meals: Array<{
    meal_name: string;
    estimated_calories: number;
    macronutrients?: any;
    logged_at: string;
  }>;
  currentDate: string;

  constructor(state: DurableObjectState) {
    this.state = state;
    this.meals = [];
    this.currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    this.initialize();
  }

  async initialize() {
    // Load persisted state
    const stored = await this.state.storage.get<{
      meals: any[];
      date: string;
    }>('meals');

    if (stored) {
      // If it's a new day, reset meals
      if (stored.date === this.currentDate) {
        this.meals = stored.meals;
      } else {
        // New day - clear old meals
        this.meals = [];
        await this.state.storage.deleteAll();
      }
    }
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Store a new meal
    if (path === '/store' && request.method === 'POST') {
      const mealData = await request.json();
      
      // Add timestamp
      const meal = {
        ...mealData,
        logged_at: new Date().toISOString(),
      };

      this.meals.push(meal);

      // Persist to storage
      await this.state.storage.put('meals', {
        meals: this.meals,
        date: this.currentDate,
      });

      return new Response(
        JSON.stringify({ success: true, meal }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get daily total
    if (path === '/total' && request.method === 'GET') {
      const total_calories = this.meals.reduce(
        (sum, meal) => sum + (meal.estimated_calories || 0),
        0
      );

      return new Response(
        JSON.stringify({
          total_calories,
          meals: this.meals.map(m => ({
            meal_name: m.meal_name,
            estimated_calories: m.estimated_calories,
            logged_at: m.logged_at,
          })),
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get all meals
    if (path === '/meals' && request.method === 'GET') {
      return new Response(
        JSON.stringify({
          meals: this.meals,
          total_calories: this.meals.reduce(
            (sum, meal) => sum + (meal.estimated_calories || 0),
            0
          ),
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response('Not Found', { status: 404 });
  }
}


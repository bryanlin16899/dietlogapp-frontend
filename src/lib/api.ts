export const API_BASE_URL = 'http://127.0.0.1:8000';

export interface Ingredient {
  id: number;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  serving_size_grams: number;
  serving_calories: number;
  serving_protein: number;
  serving_fat: number;
  serving_carbohydrates: number;
  added_by_image: boolean;
}

export interface IngredientListResponse {
  ingredients: Ingredient[];
}

export const fetchIngredientList = async (searchTerm: string): Promise<IngredientListResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ingredient/get_ingredient_list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: searchTerm })
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching ingredient list:', error);
    throw error;
  }
};

export type UnitType = 'grams' | 'servings';

export const recordDietIntake = async (
  userName: string, 
  foodName: string, 
  quantity: number, 
  unitType: UnitType = 'grams'
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/diet/intake`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_name: userName,
        food_name: foodName,
        quantity: quantity,
        unit_type: unitType
      })
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error recording intake:', error);
    throw error;
  }
};

export const fetchDietLog = async (userName: string, date: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/diet/get_diet_log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: date,
        name: userName
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching diet log:', error);
    throw error;
  }
};

export const removeIntakeById = async (foodId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/diet/remove_intake_by_id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: foodId })
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error removing intake:', error);
    throw error;
  }
};

export const deleteIngredient = async (ingredientId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ingredient/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: ingredientId })
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    throw error;
  }
};

export interface CreateIngredientData {
  name: string;
  calories: number;
  fat: number;
  protein: number;
  carbohydrates: number;
  serving_size_grams: number;
  serving_calories: number;
  serving_protein: number;
  serving_fat: number;
  serving_carbohydrates: number;
}

export const createIngredient = async (ingredientData: CreateIngredientData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ingredient/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingredientData)
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating ingredient:', error);
    throw error;
  }
};

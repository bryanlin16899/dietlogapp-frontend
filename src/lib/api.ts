
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
  image_base64?: string;
  unit_type: string
}

export interface IngredientListResponse {
  ingredients: Ingredient[];
}

export interface IntakeFood {
  id: number;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  quantity: number;
  unit_type: string;
  date: string;
}
export interface GetDietLogResponse {
  date: string;
  intake: number;
  consumption: number;
  intake_foods: [IntakeFood]
}

export interface IngredientListResponse {
  ingredients: Ingredient[];
  total_count: number;
  total_pages: number;
  current_page: number;
  page_size: number
}

export const fetchIngredientList = async (
  searchTerm: string, 
  withImage: boolean,
  options: { 
    page?: number; 
    page_size?: number; 
  } = {}
): Promise<IngredientListResponse> => {
  try {
    const { page = 1, page_size = 10 } = options;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient/get_ingredient_list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name: searchTerm,
        with_image: withImage,
        page,
        page_size
      })
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

export const fetchIngredientById = async (ingredientId: number): Promise<Ingredient> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient/get_ingredient?id=${ingredientId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching ingredient by ID:', error);
    throw error;
  }
};

export type UnitType = 'grams' | 'servings';

export const recordDietIntake = async (
  googleId: string, 
  foodName: string, 
  quantity: number, 
  unitType: UnitType = 'grams',
  logDate: string
) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/diet/intake`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        google_id: googleId,
        food_name: foodName,
        quantity: quantity,
        unit_type: unitType,
        log_date: logDate
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

export const fetchDietLog = async (googleId: string, date: string): Promise<GetDietLogResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/diet/get_diet_log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        log_date: date,
        google_id: googleId
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

export const removeIntakeById = async (googleId: string, foodId: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/diet/remove_intake_by_id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ google_id: googleId, id: foodId })
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient/delete`, {
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
  unit_type: UnitType;
  name: string;
  calories: number;
  fat: number;
  protein: number;
  carbohydrates: number;
  serving_size_grams: number|null;
  image_base64?: string;
}

export const createIngredient = async (ingredientData: CreateIngredientData) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient/add`, {
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

export const createIngredientByImage = async (imageFile: File, name: string) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('name', name);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient/add`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating ingredient by image:', error);
    throw error;
  }
};

export const updateIngredient = async (ingredientData: {
  id: number;
  name: string;
  calories: number;
  fat: number;
  protein: number;
  carbohydrates: number;
  serving_size_grams: number;
  image_base64?: string;
}) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient/update`, {
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
    console.error('Error updating ingredient:', error);
    throw error;
  }
};

export const recordDietIntakeManually = async (
  googleId: string, 
  logDate: string, 
  foodName: string, 
  calories: number,
  quantity: number, 
  unitType: UnitType = 'grams'
): Promise<GetDietLogResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/diet/intake-manually`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        google_id: googleId,
        log_date: logDate,
        food_name: foodName,
        calories: calories,
        quantity: quantity,
        unit_type: unitType
      })
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error recording manual intake:', error);
    throw error;
  }
};

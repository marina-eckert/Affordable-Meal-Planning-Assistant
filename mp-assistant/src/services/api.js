const API_BASE_URL = `http://backend-service:8080/api`;

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem("authToken");

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "API request failed");
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// Auth API
export const authApi = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userId", data.userId);
      // These will be set in Login.jsx from the response, but good to have them in the data object
    }
    return data;
  },

  signup: async (userName, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, email, password }),
    });
    return handleResponse(response);
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
  },
};

// Users API
export const usersApi = {
  getUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },

  updateUser: async (userId, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  uploadProfilePicture: async (userId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile-picture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },
};

// Recipes API
export const recipesApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/recipes`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },
};

// Ingredients API
export const ingredientsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/ingredients`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },
};

// Grocery List API
export const groceryApi = {
  getItems: async (userId) => {
    const response = await fetch(
      `${API_BASE_URL}/users/${userId}/grocery-list`,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return handleResponse(response);
  },

  addItem: async (userId, ingredient, quantity) => {
    const body = { quantity };
    // Check if ingredient is a UUID (existing ID) or a name
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ingredient);

    if (isUuid) {
      body.ingredientId = ingredient;
    } else {
      body.ingredientName = ingredient;
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}/grocery-list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  updateItem: async (itemId, quantity) => {
    const response = await fetch(
      `${API_BASE_URL}/grocery-list/items/${itemId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ quantity }),
      }
    );
    return handleResponse(response);
  },

  deleteItem: async (itemId) => {
    const response = await fetch(
      `${API_BASE_URL}/grocery-list/items/${itemId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return handleResponse(response);
  },
};

// Meal Plan API
export const mealPlanApi = {
  getMealPlan: async (userId, weekStart) => {
    const response = await fetch(
      `${API_BASE_URL}/users/${userId}/mealplan?weekStart=${weekStart}`,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return handleResponse(response);
  },

  generateRandom: async (userId, weekStart, budget) => {
    const url = new URL(`${API_BASE_URL}/users/${userId}/mealplan/random`);
    url.searchParams.append("weekStart", weekStart);
    if (budget) url.searchParams.append("budget", budget);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
    );
    return handleResponse(response);
  },

  addItem: async (userId, date, mealType, recipeId) => {
    const response = await fetch(
      `${API_BASE_URL}/users/${userId}/mealplan/item`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ date, mealType, recipeId }),
      }
    );
    return handleResponse(response);
  },

  updateItem: async (itemId, newRecipeId) => {
    const response = await fetch(
      `${API_BASE_URL}/mealplan/items/${itemId}?newRecipeId=${newRecipeId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return handleResponse(response);
  },

  deleteItem: async (itemId) => {
    const response = await fetch(`${API_BASE_URL}/mealplan/items/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },

  deleteMealPlan: async (mealPlanId) => {
    const response = await fetch(`${API_BASE_URL}/mealplan/${mealPlanId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },
};
export const favoritesApi = {
  getUserFavorites: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },
  addFavorite: async (userId, recipeId) => {
    const response = await fetch(
      `${API_BASE_URL}/users/${userId}/favorites/${recipeId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return handleResponse(response);
  },
  removeFavorite: async (userId, recipeId) => {
    const response = await fetch(
      `${API_BASE_URL}/users/${userId}/favorites/${recipeId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return handleResponse(response);
  },
};

// Chat API
export const chatApi = {
  sendMessage: async (message) => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ message }),
    });
    return handleResponse(response);
  },
};

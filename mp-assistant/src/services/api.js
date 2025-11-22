const API_BASE_URL = "http://localhost:1501/api";

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

  addItem: async (userId, ingredientId, quantity) => {
    const response = await fetch(
      `${API_BASE_URL}/users/${userId}/grocery-list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ ingredientId, quantity }),
      }
    );
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

  generateRandom: async (userId, weekStart) => {
    const response = await fetch(
      `${API_BASE_URL}/users/${userId}/mealplan/random?weekStart=${weekStart}`,
      {
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

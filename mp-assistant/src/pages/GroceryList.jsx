import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { groceryApi, ingredientsApi } from "../services/api";

import "./grocery-list.css";

export default function GroceryList() {
  const [items, setItems] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [groceryItems, allIngredients] = await Promise.all([
        groceryApi.getItems(userId),
        ingredientsApi.getAll(),
      ]);
      setItems(groceryItems);
      setIngredients(allIngredients);
    } catch (err) {
      setError("Failed to load data: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!selectedIngredient) return;

    try {
      await groceryApi.addItem(userId, selectedIngredient, quantity);
      await loadData();
      setSelectedIngredient("");
      setQuantity(1);
      setShowSuggestions(false);
    } catch (err) {
      setError("Failed to add item: " + err.message);
      console.error(err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await groceryApi.deleteItem(itemId);
      setItems(items.filter((item) => item.id !== itemId));
    } catch (err) {
      setError("Failed to remove item: " + err.message);
      console.error(err);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await groceryApi.updateItem(itemId, newQuantity);
      setItems(
        items.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      setError("Failed to update quantity: " + err.message);
      console.error(err);
    }
  };

  // Filter suggestions based on input
  const filteredIngredients = ingredients.filter(ing =>
    ing.name.toLowerCase().includes(selectedIngredient.toLowerCase())
  );

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <h2>Grocery List</h2>
        </div>
        <div className="card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Grocery List</h2>
      </div>

      {error && (
        <div className="auth-error" style={{ marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <div className="card grocery-card">
        <form onSubmit={addItem} className="add-form">
          <div className="autocomplete-wrapper">
            <input
              type="text"
              className="ingredient-input"
              value={selectedIngredient}
              onChange={(e) => {
                setSelectedIngredient(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
              placeholder="Type or select an ingredient..."
              required
            />

            {showSuggestions && selectedIngredient && filteredIngredients.length > 0 && (
              <ul className="suggestions-list">
                {filteredIngredients.map((ing) => (
                  <li
                    key={ing.id}
                    className="suggestion-item"
                    onClick={() => {
                      setSelectedIngredient(ing.name);
                      setShowSuggestions(false);
                    }}
                  >
                    {ing.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <input
            type="number"
            min="1"
            className="qty-input"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <button type="submit" className="add-btn">
            + Add
          </button>
        </form>

        {items.length ? (
          <ul className="grocery-list">
            {items.map((item) => (
              <li key={item.id} className="grocery-item">
                <span className="item-name">{item.ingredient.name}</span>
                <div className="qty-controls">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, Number(e.target.value))
                    }
                    min="1"
                  />
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-list">Your list is empty. Add some items!</p>
        )}
      </div>
    </div>
  );
}

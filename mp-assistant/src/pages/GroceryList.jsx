import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { groceryApi, ingredientsApi } from "../services/api";

export default function GroceryList() {
  const [items, setItems] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          <select
            value={selectedIngredient}
            onChange={(e) => setSelectedIngredient(e.target.value)}
            required
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            <option value="">Select an ingredient...</option>
            {ingredients.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={{
              width: "80px",
              padding: "0.75rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
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

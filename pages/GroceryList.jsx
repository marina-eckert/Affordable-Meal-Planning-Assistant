import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function GroceryList() {
  const [items, setItems] = useState([
    { name: "Tomatoes", qty: 3 },
    { name: "Pasta", qty: 1 },
  ]);
  const [newItem, setNewItem] = useState("");

  const addItem = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      setItems([...items, { name: newItem, qty: 1 }]);
      setNewItem("");
    }
  };

  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const increase = (i) => setItems(items.map((it, idx) =>
      idx === i ? { ...it, qty: it.qty + 1 } : it
  ));
  const decrease = (i) => setItems(items.map((it, idx) =>
      idx === i ? { ...it, qty: Math.max(1, it.qty - 1) } : it
  ));
  const changeQty = (i, v) => setItems(items.map((it, idx) =>
      idx === i ? { ...it, qty: Math.max(1, Number(v) || 1) } : it
  ));

  return (
    <div className="page">
      <div className="page-header">
        <h2>Grocery List</h2>
        <Link to="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="card grocery-card">
        <form onSubmit={addItem} className="add-form">
          <input
            type="text"
            placeholder="Enter grocery item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <button type="submit" className="add-btn">+ Add</button>
        </form>

        {items.length ? (
          <ul className="grocery-list">
            {items.map((it, i) => (
              <li key={i} className="grocery-item">
                <span className="item-name">{it.name}</span>
                <div className="qty-controls">
                  <button type="button" onClick={() => decrease(i)}>-</button>
                  <input
                    type="number"
                    value={it.qty}
                    onChange={(e) => changeQty(i, e.target.value)}
                    min="1"
                  />
                  <button type="button" onClick={() => increase(i)}>+</button>
                </div>
                <button className="remove-btn" onClick={() => removeItem(i)}>✕</button>
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

import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState({
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    preference: "Vegetarian",
    budget: 50,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Profile Settings</h2>
        <Link to="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="form">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />

          <label>Dietary Preference</label>
          <select
            name="preference"
            value={user.preference}
            onChange={handleChange}
          >
            <option>Vegetarian</option>
            <option>Vegan</option>
            <option>Pescatarian</option>
            <option>No Preference</option>
          </select>

          <label>Weekly Budget ($)</label>
          <input
            type="number"
            name="budget"
            value={user.budget}
            onChange={handleChange}
          />

          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

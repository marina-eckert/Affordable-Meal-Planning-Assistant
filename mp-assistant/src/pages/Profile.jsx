import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { usersApi } from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await usersApi.getUser(userId);
      setUser({
        name: userData.userName,
        email: userData.email,
        preference: getDietaryPreferenceLabel(userData.dietaryPreference),
        budget: userData.weeklyBudgetInDollars,
        dietaryPreferenceValue: userData.dietaryPreference,
      });
    } catch (err) {
      setError("Failed to load profile: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDietaryPreferenceLabel = (value) => {
    const labels = {
      0: "No Preference",
      1: "Vegetarian",
      2: "Vegan",
      3: "Pescatarian",
    };
    return labels[value] || "No Preference";
  };

  const getDietaryPreferenceValue = (label) => {
    const values = {
      "No Preference": 0,
      Vegetarian: 1,
      Vegan: 2,
      Pescatarian: 3,
    };
    return values[label] || 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      await usersApi.updateUser(userId, {
        userName: user.name,
        email: user.email,
        dietaryPreference: getDietaryPreferenceValue(user.preference),
        weeklyBudgetInDollars: Number(user.budget),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to update profile: " + err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <h2>Profile Settings</h2>
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
        <h2>Profile Settings</h2>
      </div>
      <div className="card">
        {error && (
          <div className="auth-error" style={{ marginBottom: "1rem" }}>
            {error}
          </div>
        )}
        {success && (
          <div
            className="auth-success"
            style={{
              marginBottom: "1rem",
              padding: "0.75rem",
              background: "#d4edda",
              color: "#155724",
              borderRadius: "4px",
            }}
          >
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={user?.name || ""}
            onChange={handleChange}
            disabled={saving}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user?.email || ""}
            onChange={handleChange}
            disabled={saving}
            required
          />

          <label>Dietary Preference</label>
          <select
            name="preference"
            value={user?.preference || "No Preference"}
            onChange={handleChange}
            disabled={saving}
          >
            <option>No Preference</option>
            <option>Vegetarian</option>
            <option>Vegan</option>
            <option>Pescatarian</option>
          </select>

          <button type="submit" className="save-btn" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

import React from "react";
import "./Dashboard.css";
import { PlusCircle, Camera, ShoppingCart, Pencil } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      {/* === Top Summary Cards === */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">$</div>
          <div>
            <h3>$47.50</h3>
            <p>Remaining Budget</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">🍽️</div>
          <div>
            <h3>18</h3>
            <p>Meals This Week</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">💰</div>
          <div>
            <h3>$23.40</h3>
            <p>Money Saved</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">♻️</div>
          <div>
            <h3>12%</h3>
            <p>Food Waste Reduced</p>
          </div>
        </div>
      </div>

      {/* === Meal Plan Section === */}
      <div className="dashboard-main">
        <div className="meal-plan">
          <div className="section-header">
            <h3>This Week’s Meal Plan</h3>
            <button className="edit-btn">Edit Plan</button>
          </div>

          <div className="meal-grid">
            {[
              ["Oatmeal", 2.5],
              ["Toast", 1.8],
              ["Cereal", 2.2],
              ["Not Planned"],
              ["Not Planned"],
              ["Not Planned"],
              ["Not Planned"],
            ].map((meal, i) => (
              <div key={i} className="meal-day">
                <div className="day-label">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </div>
                <div className="meal-box">
                  {meal[0] === "Not Planned" ? (
                    <span className="add-placeholder">+ Add</span>
                  ) : (
                    <>
                      <div className="meal-name">{meal[0]}</div>
                      <div className="meal-cost">${meal[1].toFixed(2)}</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === Right Column === */}
        <div className="quick-actions">
          <div className="action-card">
            <button className="add-leftovers">
              <PlusCircle size={18} /> Add Leftovers
            </button>
            <button className="scan-fridge">
              <Camera size={18} /> Scan Fridge
            </button>
            <button className="view-grocery">
              <ShoppingCart size={18} /> View Grocery List
            </button>
          </div>

          <div className="suggested-recipes">
            <h4>Suggested Recipes</h4>
            <ul>
              <li>
                <div>
                  <p>Budget Veggie Pasta</p>
                  <span>$3.20 per serving</span>
                </div>
              </li>
              <li>
                <div>
                  <p>Simple Rice Bowl</p>
                  <span>$2.80 per serving</span>
                </div>
              </li>
              <li>
                <div>
                  <p>Hearty Soup</p>
                  <span>$2.50 per serving</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="weekly-tip">
            <h4>Weekly Tip</h4>
            <p>
              Buy seasonal vegetables to save up to 30% on your grocery bill.
              This week, focus on root vegetables like carrots and potatoes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

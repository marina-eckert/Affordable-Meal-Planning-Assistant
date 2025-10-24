import { Link } from "react-router-dom";
import "../App.css";
import "../styles/auth.css";
import icon from "../assets/images/icon.png";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        {/* Left side with logo and welcome message */}
        <div className="auth-left">
          <div className="auth-logo-container">
            <img src={icon} alt="MealPlan" className="auth-logo-img" />
            <h1>MealPlan</h1>
            <p className="tagline">Smart meal planning for your budget</p>
          </div>
          <div className="auth-features">
            <div className="feature">
              <span className="feature-icon">📊</span>
              <div>
                <h3>Plan Smarter</h3>
                <p>Create weekly meal plans in minutes</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">💰</span>
              <div>
                <h3>Save Money</h3>
                <p>Stick to your food budget</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side with form */}
        <div className="auth-right">
          <div className="auth-form-wrapper">
            {children}
          </div>
          <div className="auth-footer">
            <p>© {new Date().getFullYear()} MealPlan. All rights reserved.</p>
            <div className="auth-links">
              <Link to="/privacy">Privacy</Link>
              <span>•</span>
              <Link to="/terms">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import "./components.css";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h2>Welcome back! Here's your weekly meal overview</h2>
      </div>

      <div className="header-right">
        <Link to="/planner">
          <button className="new-week-btn">+ Plan New Week</button>
        </Link>
      </div>
    </header>
  );
}

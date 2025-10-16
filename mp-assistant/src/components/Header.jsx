import "./components.css";
import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h2>Dashboard</h2>
        <p>Welcome back! Here's your weekly meal overview</p>
      </div>

      <div className="header-right">
        <button className="notification-btn">
          <Bell size={20} />
        </button>
        <button className="new-week-btn">+ Plan New Week</button>
      </div>
    </header>
  );
}

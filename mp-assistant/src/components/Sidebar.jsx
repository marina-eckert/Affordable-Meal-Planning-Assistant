import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  ShoppingCart,
  BarChart2,
  User,
} from "lucide-react";
import "./components.css";
import icon from "../assets/images/icon.png";

export default function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/dashboard",
    },
    { name: "Meal Planner", icon: <Calendar size={18} />, path: "/planner" },
    { name: "Recipes", icon: <BookOpen size={18} />, path: "/recipes" },
    {
      name: "Grocery List",
      icon: <ShoppingCart size={18} />,
      path: "/grocery",
    },
    { name: "Insights", icon: <BarChart2 size={18} />, path: "/insights" },
    { name: "Profile", icon: <User size={18} />, path: "/profile" },
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-header">
          <img src={icon} alt="Logo" className="icon" />
          <div>
            <h1>MealPlan</h1>
            <p>Budget-Friendly</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}

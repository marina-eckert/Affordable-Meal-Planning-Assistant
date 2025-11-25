import { useState, useEffect } from "react";
import "./components.css";
import { Bell, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { usersApi } from "../services/api";

export default function Header({ onToggleSidebar }) {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "User");
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePictureUrl"));

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const user = await usersApi.getUser(userId);
          if (user.userName) {
            setUserName(user.userName);
            localStorage.setItem("userName", user.userName);
          }
          if (user.profilePictureUrl) {
            setProfilePic(user.profilePictureUrl);
            localStorage.setItem("profilePictureUrl", user.profilePictureUrl);
          }
        } catch (error) {
          console.error("Failed to fetch user data in header:", error);
        }
      }
    };

    // Listen for updates from Profile page
    const handleUserUpdate = () => {
      setUserName(localStorage.getItem("userName") || "User");
      setProfilePic(localStorage.getItem("profilePictureUrl"));
    };

    window.addEventListener("userUpdated", handleUserUpdate);

    // Always fetch fresh data on mount to handle cross-device updates
    fetchUserData();

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate);
    };
  }, []);

  return (
    <header className="header">
      <button className="burger-menu" onClick={onToggleSidebar}>
        <Menu size={24} />
      </button>

      <div className="header-left">
        {profilePic && (
          <img
            src={`http://${window.location.hostname}:1501${profilePic}`}
            alt="Profile"
            className="header-profile-pic"
          />
        )}
        <h2>Welcome back, {userName}! Here's your weekly meal overview</h2>
      </div>

      <div className="header-right">
        <Link to="/planner">
          <button className="new-week-btn">+ Plan New Week</button>
        </Link>
      </div>
    </header >
  );
}

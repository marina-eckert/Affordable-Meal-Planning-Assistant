import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { usersApi } from "../services/api";
import "./components.css";

export default function Footer() {
  const [userName, setUserName] = useState("Loading...");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await usersApi.getUser(userId);
      setUserName(userData.userName);
    } catch (err) {
      console.error("Failed to load user:", err);
      setUserName("User");
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // optional, if you want to fully log out
    window.location.href = "/"; // redirect to login page
  };

  return (
    <footer className="footer">
      <div className="footer-left">
        <img
          src="/user-avatar.png"
          alt="User avatar"
          className="footer-avatar"
        />
        <div>
          <div className="footer-name">{userName}</div>
          <div className="footer-plan">Free Plan</div>
        </div>
      </div>

      <div
        className="footer-right"
        onClick={handleLogout}
        style={{ cursor: "pointer" }}
      >
        <LogOut size={20} strokeWidth={2} />
      </div>
    </footer>
  );
}

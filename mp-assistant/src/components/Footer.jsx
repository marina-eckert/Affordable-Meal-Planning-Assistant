import React from "react";
import { EllipsisVertical } from "lucide-react";
import "./components.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <img
          src="/user-avatar.png"
          alt="User avatar"
          className="footer-avatar"
        />
        <div>
          <div className="footer-name">Sarah Chen</div>
          <div className="footer-plan">Free Plan</div>
        </div>
      </div>

      <div className="footer-right">
        <EllipsisVertical size={20} strokeWidth={2} />
      </div>
    </footer>
  );
}

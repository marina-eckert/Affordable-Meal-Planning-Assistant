import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";

export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="layout-wrapper">
      <div className="layout">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <div className="main-section">
          <Header onToggleSidebar={toggleSidebar} />
          <main className="main-content">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

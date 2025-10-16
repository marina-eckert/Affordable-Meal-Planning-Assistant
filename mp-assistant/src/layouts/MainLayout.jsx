import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";

export default function MainLayout({ children }) {
  return (
    <div className="layout-wrapper">
      <div className="layout">
        <Sidebar />
        <div className="main-section">
          <Header />
          <main className="main-content">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

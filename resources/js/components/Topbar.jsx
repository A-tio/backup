import { Link } from "react-router-dom";
import './Topbar.css';

export default function Topbar() {
    const userInitials = "AB"; 
    const username = "Alyssa";

    return (
        <div className="topbar">
            <div className="left-section">
                <h1 className="logo">BrandName</h1>
                <nav className="nav-links">
                    <Link to="/" className="nav-link">Menu</Link>
                    <Link to="/sales" className="nav-link">Sales</Link>
                    <Link to="/analytics" className="nav-link">Analytics</Link>
                </nav>
            </div>

            <div className="user-section">
                <div className="user-initials">{userInitials}</div>
                <span className="welcome-text">Welcome, {username}!</span>
            </div>
        </div>
    );
}

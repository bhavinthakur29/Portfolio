import SocialLinks from '../SocialLinks/SocialLinks';
import { Link } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => (
    <div className="layout">
        <header className="layout-header">
            <nav>
                <ul className="nav-list">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/projects">Projects</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </nav>
        </header>
        <main className="layout-main">{children}</main>
        <footer className="layout-footer">
            <SocialLinks />
            <p>&copy; {new Date().getFullYear()} Bhavin Thakur. All rights reserved.</p>
        </footer>
    </div>
);

export default Layout; 
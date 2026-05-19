import { Search, Menu } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { navLinks } from '../data';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="container header-content">
                <div className="logo-container">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                    </div>
                    <div className="logo-text">
                        <h1>جامعة الملك فيصل</h1>
                        <span>قوة الكلمة.. دقة الخبر</span>
                    </div>
                </div>

                <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
                    <ul>
                        {navLinks.map((link) => (
                            <li key={link.id}>
                                <Link to={link.href} className={link.id === 1 ? 'active' : ''}>
                                    {link.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="header-actions">
                    <button className="icon-btn search-trigger" aria-label="Search">
                        <Search size={20} />
                    </button>
                    <button
                        className="icon-btn mobile-menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Menu"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UserCog } from 'lucide-react';
import './Hero.css';
import API_BASE_URL from '../apiConfig';

const Hero = () => {
    const displayData = {
        title: "منصة إخبارية لكلية العلوم الهندسية والتكنولوجية",
        summary: "منبر أكاديمي راق، يقدم الخبر بموثوقية وأناقة، ليكون مرجعكم الأول في عالم الابتكار والبحث العلمي.",
        image: "/images/hero-new.jpeg"
    };

    return (
        <section className="hero-section">
            <div className="hero-card" style={{ backgroundImage: `url('/images/hero-new.jpeg')` }}>
                <div className="hero-overlay">
                    <div className="container">
                        <div className="hero-content">
                            <span className="hero-badge">أكاديمي</span>
                            <h2 className="hero-title">{displayData.title}</h2>
                            <p className="hero-summary">{displayData.summary}</p>
                            
                            <div className="hero-actions">
                                <button className="hero-btn main-btn">
                                    اقرأ المزيد
                                    <ArrowLeft size={20} />
                                </button>
                                
                                <Link to="/publisher" className="hero-btn pub-link">
                                    وضع الناشر
                                    <UserCog size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

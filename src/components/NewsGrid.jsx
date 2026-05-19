import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { ChevronLeft, Calendar, ArrowLeft, RefreshCw, WifiOff, FileText, Download } from 'lucide-react';

import './NewsGrid.css';
import API_BASE_URL from '../apiConfig';

const NewsGrid = ({ endpoint, title, viewAllPath, defaultCategory = "أخبار", detailsPathPrefix = "/news" }) => {
    const [gridNews, setGridNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(false);

    const fetchData = () => {
        if (!endpoint) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setApiError(false);
        fetch(`${API_BASE_URL}/${endpoint}`, { cache: 'no-store' })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setGridNews(data);
                } else {
                    // API returned error object instead of array (DB connection issue)
                    setApiError(true);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setApiError(true);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [endpoint]);

    if (loading) return <div className="loading-state">⏳ جاري التحميل...</div>;

    if (apiError) return (
        <section className="news-grid-section">
            <div className="section-header">
                <div className="title-wrapper">
                    <span className="title-decorator"></span>
                    <h2 className="section-title">{title || "آخر الأخبار والمستجدات"}</h2>
                </div>
            </div>
            <div style={{ background: '#fff3cd', color: '#856404', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #ffc107' }}>
                <WifiOff size={32} style={{ marginBottom: '8px', opacity: 0.7 }} />
                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>⚠️ تعذر الاتصال بالخادم</p>
                <p style={{ fontSize: '14px', marginBottom: '16px' }}>
                    تأكدي من تشغيل سيرفر Node.js بكتابة هذا الأمر في Terminal جديد:
                    <br />
                    <code style={{ background: '#333', color: '#0f0', padding: '6px 12px', borderRadius: '6px', display: 'inline-block', marginTop: '8px', direction: 'ltr' }}>
                        npm run server
                    </code>
                </p>
                <button onClick={fetchData} style={{ background: '#0d6efd', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <RefreshCw size={16} /> إعادة المحاولة
                </button>
            </div>
        </section>
    );

    return (
        <section className="news-grid-section">
            <div className="section-header">
                <div className="title-wrapper">
                    <span className="title-decorator"></span>
                    <h2 className="section-title">{title || "آخر الأخبار والمستجدات"}</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={fetchData} title="تحديث" style={{ background: 'transparent', border: '1px solid #ccc', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#666' }}>
                        <RefreshCw size={14} /> تحديث
                    </button>
                    {viewAllPath && (
                        <a href={viewAllPath} className="view-all-link">
                            مشاهدة الكل
                            <ChevronLeft size={18} />
                        </a>
                    )}
                </div>
            </div>

            {gridNews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888', background: '#f9f9f9', borderRadius: '12px' }}>
                    <p style={{ fontSize: '18px' }}>📭 لا توجد بيانات بعد</p>
                    <p style={{ fontSize: '14px', marginTop: '8px' }}>
                        يمكنك إضافة محتوى من <strong>لوحة الناشر</strong>
                    </p>
                </div>
            ) : (
                <div className="news-grid">
                    {gridNews.map((item) => (
                        <article key={item.id} className="news-card">
                            <div className="card-image-wrapper">
                                <img
                                    src={item.image || "/images/news-bg.png"}
                                    alt={item.title}
                                    className="card-image"
                                />
                                <span className={`card-badge ${item.category === 'إعلانات' ? 'bg-orange' : 'bg-red'}`}>
                                    {item.category || defaultCategory}
                                </span>
                            </div>
                            <div className="card-content">
                                <div className="card-meta">
                                    <Calendar size={14} />
                                    <span className="card-date">{item.date || (item.created_at ? item.created_at.split(' ')[0] : '')}</span>
                                </div>
                                <h3 className="card-title">{item.title}</h3>
                                <p className="card-summary">
                                    {item.summary || (item.content ? item.content.substring(0, 120) + '...' : '')}
                                </p>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <Link to={`${detailsPathPrefix}/${item.id}`} className="read-more-link">
                                        اقرأ المزيد
                                        <ArrowLeft size={16} />
                                    </Link>
                                    
                                    {item.file_url && (
                                        <a 
                                            href={item.file_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="file-download-btn"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                fontSize: '13px',
                                                color: '#0d6efd',
                                                textDecoration: 'none',
                                                padding: '4px 8px',
                                                border: '1px solid #0d6efd',
                                                borderRadius: '6px',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <FileText size={14} />
                                            الملف الخارجي
                                        </a>
                                    )}
                                </div>

                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
};

export default NewsGrid;

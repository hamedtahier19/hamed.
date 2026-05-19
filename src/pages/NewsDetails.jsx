import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowRight, FileText, Download } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

const NewsDetails = ({ endpoint = 'news.php', basePath = '/news', backTitle = 'الأخبار' }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/${endpoint}?id=${id}`)
            .then(res => res.json())
            .then(data => {
                setNews(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="loading-state">⏳ جاري التحميل...</div>;
    if (!news || news.error) return (
        <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
            <h2 style={{ color: '#dc3545' }}>❌ المحتوى غير موجود</h2>
            <button onClick={() => navigate(basePath)} className="submit-btn" style={{ marginTop: '20px', width: 'auto', padding: '10px 25px' }}>
                العودة لـ {backTitle}
            </button>
        </div>
    );

    return (
        <div className="container page-container">
            <button onClick={() => navigate(basePath)} className="back-btn" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#0d6efd', cursor: 'pointer', fontWeight: 'bold' }}>
                <ArrowRight size={20} /> العودة لـ {backTitle}
            </button>
            
            <article className="news-details-article" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header className="details-header" style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <h1 className="details-title" style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '15px', color: '#1a1a1a' }}>{news.title}</h1>
                    <div className="details-meta" style={{ display: 'flex', gap: '20px', color: '#666', fontSize: '14px', borderBottom: '1px solid #eee', paddingBottom: '15px', justifyContent: 'center' }}>

                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} /> {news.date || (news.created_at ? news.created_at.split(' ')[0] : '')}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={16} /> {news.author_name || "الناشر"}</span>
                    </div>
                </header>

                <div className="details-image-container" style={{ 
                    marginBottom: '30px', 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    maxWidth: '800px',
                    margin: '0 auto 30px auto'
                }}>
                    <img 
                        src={news.image || "/images/news-bg.png"} 
                        alt={news.title} 
                        style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover', display: 'block' }}
                    />
                </div>

                <div className="details-content" style={{ 
                    fontSize: '1.2rem', 
                    lineHeight: '1.8', 
                    color: '#333', 
                    whiteSpace: 'pre-wrap', 
                    textAlign: 'justify',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>

                    {news.content}
                    
                    {news.file_url && (
                        <div style={{ marginTop: '40px', padding: '20px', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <FileText size={32} color="#0d6efd" />
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '16px' }}>الملف الخارجي المرفق</h4>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>انقر للتحميل أو العرض</p>
                                </div>
                            </div>
                            <a 
                                href={news.file_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={{ 
                                    background: '#0d6efd', 
                                    color: 'white', 
                                    padding: '10px 20px', 
                                    borderRadius: '8px', 
                                    textDecoration: 'none', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                }}
                            >
                                <Download size={18} /> تحميل الملف
                            </a>
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
};

export default NewsDetails;

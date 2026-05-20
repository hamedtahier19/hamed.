import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Save, X, Newspaper, Megaphone, FileText, Mail } from 'lucide-react';
import API_BASE_URL from '../../apiConfig';

const Dashboard = () => {
  const [newsList, setNewsList] = useState([]);
  const [announcementsList, setAnnouncementsList] = useState([]);
  const [articlesList, setArticlesList] = useState([]);
  const [messagesList, setMessagesList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('news'); // 'news', 'announcements', 'articles'
  
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', content: '', image: '', summary: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [newsRes, annRes, artRes, msgRes] = await Promise.all([
        fetch(`${API_BASE_URL}/news.php`).catch(() => ({ json: () => [] })),
        fetch(`${API_BASE_URL}/announcements.php`).catch(() => ({ json: () => [] })),
        fetch(`${API_BASE_URL}/articles.php`).catch(() => ({ json: () => [] })),
        fetch(`${API_BASE_URL}/messages.php`).catch(() => ({ json: () => [] }))
      ]);

      const newsData = await newsRes.json();
      const annData = await annRes.json();
      const artData = await artRes.json();
      const msgData = await msgRes.json();

      if (Array.isArray(newsData)) setNewsList(newsData);
      if (Array.isArray(annData)) setAnnouncementsList(annData);
      if (Array.isArray(artData)) setArticlesList(artData);
      if (Array.isArray(msgData)) setMessagesList(msgData);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getEndpoint = () => {
    if (activeTab === 'news') return 'news.php';
    if (activeTab === 'announcements') return 'announcements.php';
    if (activeTab === 'articles') return 'articles.php';
    return '';
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا العنصر؟")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/${getEndpoint()}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditData({ 
      title: item.title, 
      content: item.content, 
      image: item.image || '',
      summary: item.summary || ''
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/${getEndpoint()}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...editData })
      });
      if (response.ok) {
        setEditingId(null);
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getActiveList = () => {
    if (activeTab === 'news') return newsList;
    if (activeTab === 'announcements') return announcementsList;
    if (activeTab === 'articles') return articlesList;
    return [];
  };

  const tabStyle = (tab) => ({
    padding: '10px 20px',
    cursor: 'pointer',
    borderBottom: activeTab === tab ? '3px solid #0d6efd' : '3px solid transparent',
    color: activeTab === tab ? '#0d6efd' : '#555',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
    background: 'none',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    fontSize: '16px'
  });

  return (
    <div>
      <div className="publisher-header">
        <h1>لوحة التحكم</h1>
        <p>مرحباً بك في لوحة تحكم الناشر. يمكنك إدارة المحتوى ومتابعة الإحصائيات.</p>
      </div>
      
      <div className="dashboard-cards" style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 1, minWidth: '200px', padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <Newspaper size={28} style={{ marginBottom: '10px', color: '#0d6efd' }} />
          <h3>أخبار الكلية</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0 0' }}>{newsList.length}</p>
        </div>
        <div className="card" style={{ flex: 1, minWidth: '200px', padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <FileText size={28} style={{ marginBottom: '10px', color: '#198754' }} />
          <h3>المقالات</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0 0' }}>{articlesList.length}</p>
        </div>
        <div className="card" style={{ flex: 1, minWidth: '200px', padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <Megaphone size={28} style={{ marginBottom: '10px', color: '#ffc107' }} />
          <h3>الإعلانات</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0 0' }}>{announcementsList.length}</p>
        </div>
        <div className="card" style={{ flex: 1, minWidth: '200px', padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <Mail size={28} style={{ marginBottom: '10px', color: '#dc3545' }} />
          <h3>رسائل التواصل</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0 0' }}>{messagesList.length}</p>
        </div>
      </div>

      <div className="management-section" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #ccc' }}>
          <button onClick={() => {setActiveTab('news'); setEditingId(null);}} style={tabStyle('news')}>الأخبار</button>
          <button onClick={() => {setActiveTab('announcements'); setEditingId(null);}} style={tabStyle('announcements')}>الإعلانات</button>
          <button onClick={() => {setActiveTab('articles'); setEditingId(null);}} style={tabStyle('articles')}>المقالات العلمية</button>
        </div>
        
        {loading ? <p>جاري التحميل...</p> : (
          <div className="management-list" style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '12px' }}>العنوان</th>
                  <th style={{ padding: '12px' }}>تاريخ النشر</th>
                  <th style={{ padding: '12px' }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {getActiveList().length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>لا توجد عناصر حالياً</td>
                  </tr>
                ) : (
                  getActiveList().map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td style={{ padding: '12px', verticalAlign: 'top' }}>
                        {editingId === item.id ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input 
                              type="text" 
                              value={editData.title} 
                              onChange={(e) => setEditData({...editData, title: e.target.value})}
                              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                              placeholder="العنوان"
                            />
                            {activeTab === 'articles' && (
                                <input 
                                  type="text" 
                                  value={editData.summary} 
                                  onChange={(e) => setEditData({...editData, summary: e.target.value})}
                                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                  placeholder="الملخص"
                                />
                            )}
                            <textarea 
                              value={editData.content} 
                              onChange={(e) => setEditData({...editData, content: e.target.value})}
                              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px', fontFamily: 'inherit' }}
                              placeholder="المحتوى"
                            />
                            <input 
                              type="text" 
                              value={editData.image} 
                              onChange={(e) => setEditData({...editData, image: e.target.value})}
                              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                              placeholder="رابط الصورة (اختياري)"
                            />
                          </div>
                        ) : (
                          <div>
                            <span style={{ fontWeight: '500', display: 'block' }}>{item.title}</span>
                            {item.summary && <span style={{ fontSize: '13px', color: '#666', display: 'block', marginTop: '4px' }}>{item.summary}</span>}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px', color: '#666', fontSize: '14px', verticalAlign: 'top' }}>
                        {item.created_at ? item.created_at.split(' ')[0] : '---'}
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'top' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          {editingId === item.id ? (
                            <>
                              <button onClick={handleUpdate} title="حفظ" style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Save size={16} /> حفظ
                              </button>
                              <button onClick={() => setEditingId(null)} title="إلغاء" style={{ background: '#6c757d', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <X size={16} /> إلغاء
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEdit(item)} title="تعديل" style={{ background: '#ffc107', color: 'black', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Edit size={16} /> تعديل
                              </button>
                              <button onClick={() => handleDelete(item.id)} title="حذف" style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Trash2 size={16} /> حذف
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

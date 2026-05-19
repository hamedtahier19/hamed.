import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Save, X, Newspaper } from 'lucide-react';
import API_BASE_URL from '../../apiConfig';

const Dashboard = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', content: '', image: '' });

  const fetchNews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/news.php`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setNewsList(data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الخبر؟")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/news.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (response.ok) {
        fetchNews();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditData({ title: item.title, content: item.content, image: item.image || '' });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/news.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...editData })
      });
      if (response.ok) {
        setEditingId(null);
        fetchNews();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="publisher-header">
        <h1>لوحة التحكم</h1>
        <p>مرحباً بك في لوحة تحكم الناشر. يمكنك إدارة المحتوى ومتابعة الإحصائيات.</p>
      </div>
      
      <div className="dashboard-cards">
        <div className="card">
          <Newspaper size={24} style={{ marginBottom: '10px', color: '#0d6efd' }} />
          <h3>أخبار الكلية</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{newsList.length}</p>
        </div>
        <div className="card">
          <h3>المقالات</h3>
          <p>--</p>
        </div>
        <div className="card">
          <h3>الإعلانات</h3>
          <p>--</p>
        </div>
        <div className="card">
          <h3>رسائل التواصل</h3>
          <p>--</p>
        </div>
      </div>

      <div className="management-section" style={{ marginTop: '40px' }}>
        <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>إدارة الأخبار المنشورة</h2>
        
        {loading ? <p>جاري التحميل...</p> : (
          <div className="news-management-list" style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '12px' }}>عنوان الخبر</th>
                  <th style={{ padding: '12px' }}>تاريخ النشر</th>
                  <th style={{ padding: '12px' }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {newsList.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>لا توجد أخبار حالياً</td>
                  </tr>
                ) : (
                  newsList.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td style={{ padding: '12px' }}>
                        {editingId === item.id ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input 
                              type="text" 
                              value={editData.title} 
                              onChange={(e) => setEditData({...editData, title: e.target.value})}
                              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                              placeholder="العنوان"
                            />
                            <textarea 
                              value={editData.content} 
                              onChange={(e) => setEditData({...editData, content: e.target.value})}
                              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }}
                              placeholder="المحتوى"
                            />
                            <input 
                              type="text" 
                              value={editData.image} 
                              onChange={(e) => setEditData({...editData, image: e.target.value})}
                              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                              placeholder="رابط الصورة"
                            />
                          </div>
                        ) : (
                          <span style={{ fontWeight: '500' }}>{item.title}</span>
                        )}
                      </td>
                      <td style={{ padding: '12px', color: '#666', fontSize: '14px' }}>
                        {item.created_at ? item.created_at.split(' ')[0] : '---'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          {editingId === item.id ? (
                            <>
                              <button onClick={handleUpdate} title="حفظ" style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Save size={16} /> حفظ
                              </button>
                              <button onClick={() => setEditingId(null)} title="إلغاء" style={{ background: '#6c757d', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <X size={16} /> إلغاء
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEdit(item)} title="تعديل" style={{ background: '#ffc107', color: 'black', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Edit size={16} /> تعديل
                              </button>
                              <button onClick={() => handleDelete(item.id)} title="حذف" style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
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


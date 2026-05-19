import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../apiConfig';

const ManageContact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/messages.php`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div>
      <div className="publisher-header">
        <h1>✉️ رسائل اتصل بنا</h1>
        <p>هنا تظهر الرسائل التي يرسلها الزوار من صفحة <strong>اتصل بنا</strong> في الموقع الرئيسي.</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        {loading && <p>⏳ جاري تحميل الرسائل...</p>}

        {error && (
          <div style={{ background: '#f8d7da', color: '#721c24', padding: '12px 16px', borderRadius: '8px' }}>
            ❌ تعذر الاتصال بالخادم. تأكدي من تشغيل Apache وMySQL في XAMPP.
          </div>
        )}

        {!loading && !error && messages.length === 0 && (
          <p style={{ color: '#888' }}>لا توجد رسائل واردة حالياً.</p>
        )}

        {!loading && !error && messages.map((msg, index) => (
          <div key={index} style={{ background: 'white', padding: '15px', marginBottom: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h4 style={{ margin: 0 }}>{msg.name} <span style={{ color: '#999', fontWeight: 'normal' }}>({msg.email})</span></h4>
            <p style={{ marginTop: '10px', color: '#555' }}>{msg.message}</p>
            <small style={{ color: '#aaa' }}>{msg.created_at}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageContact;


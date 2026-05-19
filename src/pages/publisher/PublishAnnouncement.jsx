import React, { useState } from 'react';
import API_BASE_URL from '../../apiConfig';
import ImageUpload from '../../components/ImageUpload';
import FileUpload from '../../components/FileUpload';

const PublishAnnouncement = () => {
  const [formData, setFormData] = useState({ title: '', content: '', image: '', file_url: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const response = await fetch(`${API_BASE_URL}/announcements.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ title: '', content: '', image: '', file_url: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div>
      <div className="publisher-header">
        <h1>📢 نشر إعلان</h1>
        <p>سيظهر الإعلان فورًا في صفحة <strong>الإعلانات والفعاليات</strong> في الموقع الرئيسي.</p>
      </div>

      {status === 'success' && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          ✅ تم نشر الإعلان بنجاح! يمكنك مشاهدته في صفحة الإعلانات.
        </div>
      )}
      {status === 'error' && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          ❌ تعذر الاتصال بالخادم. تأكدي من تشغيل Apache وMySQL في XAMPP.
        </div>
      )}

      <form className="publisher-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>عنوان الإعلان</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <ImageUpload
            onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
            currentImage={formData.image}
          />
        </div>

        <div className="form-group">
          <label>ملف خارجي (اختياري - PDF/Word)</label>
          <FileUpload
            onUploadSuccess={(url) => setFormData({ ...formData, file_url: url })}
            currentFile={formData.file_url}
          />
        </div>

        <div className="form-group">
          <label>تفاصيل الإعلان</label>
          <textarea name="content" value={formData.content} onChange={handleChange} required></textarea>
        </div>
        <button type="submit" className="submit-btn">نشر الإعلان</button>
      </form>
    </div>
  );
};


export default PublishAnnouncement;

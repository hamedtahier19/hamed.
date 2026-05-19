import React, { useState } from 'react';
import API_BASE_URL from '../../apiConfig';
import ImageUpload from '../../components/ImageUpload';
import FileUpload from '../../components/FileUpload';


const PublishNews = () => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    image: '',
    file_url: '',
    author_id: 1
  });
  const [status, setStatus] = useState(null); // 'success' | 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const response = await fetch(`${API_BASE_URL}/news.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ title: '', summary: '', content: '', image: '', file_url: '', author_id: 1 });
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
        <h1>نشر خبر الكلية</h1>
        <p>سيظهر الخبر فورًا في صفحة <strong>أخبار الكلية</strong> في الموقع الرئيسي.</p>
      </div>

      {status === 'success' && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          ✅ تم نشر الخبر بنجاح! يمكنك الآن مشاهدته في صفحة أخبار الكلية.
        </div>
      )}
      {status === 'error' && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          ❌ تعذر الاتصال بالخادم. تأكدي من تشغيل Apache وMySQL في XAMPP.
        </div>
      )}

      <form className="publisher-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>عنوان الخبر</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>ملخص الخبر (اختياري)</label>
          <input type="text" name="summary" value={formData.summary} onChange={handleChange} />
        </div>
        <div className="form-group">
          <ImageUpload 
            onUploadSuccess={(url) => setFormData({...formData, image: url})} 
            currentImage={formData.image} 
          />
        </div>

        <div className="form-group">
          <label>ملف خارجي (اختياري - PDF/Word)</label>
          <FileUpload 
            onUploadSuccess={(url) => setFormData({...formData, file_url: url})} 
            currentFile={formData.file_url} 
          />
        </div>

        <div className="form-group">
          <label>محتوى الخبر</label>

          <textarea name="content" value={formData.content} onChange={handleChange} required></textarea>
        </div>
        <button type="submit" className="submit-btn">نشر الخبر</button>
      </form>
    </div>
  );
};

export default PublishNews;

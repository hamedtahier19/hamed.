import React, { useState } from 'react';
import API_BASE_URL from '../../apiConfig';

const PublishProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    student_name: '',
    year: '',
    image: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/projects.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      if(response.ok) {
        alert('تم نشر المشروع بنجاح');
        setFormData({ title: '', description: '', student_name: '', year: '', image: '' });
      } else {
        alert('حدث خطأ أثناء النشر');
      }
    } catch (error) {
      console.error(error);
      alert('تعذر الاتصال بالخادم');
    }
  };

  return (
    <div>
      <div className="publisher-header">
        <h1>نشر مشروع تخرج</h1>
      </div>
      
      <form className="publisher-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>اسم المشروع</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>اسم الطالب (أو الطلاب)</label>
          <input type="text" name="student_name" value={formData.student_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>سنة التخرج</label>
          <input type="number" name="year" value={formData.year} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>رابط الصورة (اختياري)</label>
          <input type="text" name="image" value={formData.image} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>وصف المشروع</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
        </div>
        <button type="submit" className="submit-btn">نشر المشروع</button>
      </form>
    </div>
  );
};

export default PublishProject;

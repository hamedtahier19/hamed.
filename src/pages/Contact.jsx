import { useState } from 'react';
import { Phone, MapPin, Send, Map } from 'lucide-react';
import './Contact.css';
import API_BASE_URL from '../apiConfig';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState(null); // 'success' | 'error' | 'loading'

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const response = await fetch(`${API_BASE_URL}/messages.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div className="container page-container">
            <header className="page-header">
                <h1 className="page-title">اتصل بنا</h1>
                <p className="page-subtitle">نحن هنا للإجابة على استفساراتكم ومساعدتكم. تواصلوا معنا عبر النموذج أدناه أو من خلال معلومات الاتصال المباشرة.</p>
            </header>

            <div className="contact-grid">
                {/* Form Column */}
                <div className="contact-form-wrapper">

                    {status === 'success' && (
                        <div style={{ background: '#d4edda', color: '#155724', padding: '14px 18px', borderRadius: '10px', marginBottom: '20px', fontWeight: '500' }}>
                            ✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا.
                        </div>
                    )}
                    {status === 'error' && (
                        <div style={{ background: '#f8d7da', color: '#721c24', padding: '14px 18px', borderRadius: '10px', marginBottom: '20px', fontWeight: '500' }}>
                            ❌ تعذر إرسال الرسالة. تأكد من تشغيل XAMPP (Apache + MySQL).
                        </div>
                    )}

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>الاسم الكامل</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="أدخل اسمك هنا"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="yassmamahamat@gmail.com"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>رسالتك</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="اكتب رسالتك بالتفصيل..."
                                rows="8"
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="contact-submit-btn" disabled={status === 'loading'}>
                            {status === 'loading' ? '⏳ جاري الإرسال...' : 'إرسال الرسالة'}
                            {status !== 'loading' && <Send size={18} />}
                        </button>
                    </form>
                </div>

                {/* Info Column */}
                <div className="contact-info-wrapper">
                    <div className="info-card-new address-card">
                        <div className="info-icon-box">
                            <MapPin size={24} />
                        </div>
                        <div className="info-text">
                            <h3>العنوان</h3>
                            <p>حي الجامعة ام رقيبة </p>
                            <p>تشاد مدينة انجمينا   </p>
                        </div>
                    </div>

                    <div className="info-card-new phone-card">
                        <div className="info-icon-box">
                            <Phone size={24} />
                        </div>
                        <div className="info-text">
                            <h3>الهاتف</h3>
                            <p>  +235 99198243</p>
                            <p>  +235 60501219</p>
                        </div>
                    </div>

                    <div className="map-preview-card">
                        <div className="map-overlay">
                            <button className="view-map-btn">
                                <Map size={18} />
                                عرض الخريطة
                            </button>
                        </div>
                        <img src="/images/contact-bg.png" alt="Map Location" className="map-placeholder-img" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

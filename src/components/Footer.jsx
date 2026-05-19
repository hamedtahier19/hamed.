import { Mail, Share2 } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <div className="logo-icon-small">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                </svg>
                            </div>
                            <h2>جامعة الملك فيصل</h2>
                        </div>
                        <p className="footer-description">
                            منصة أكاديمية رائدة تهدف إلى إبراز الإنجازات العلمية والبحثية، وتسهيل الوصول إلى المعلومات والمستجدات الجامعية بموثوقية تامة.
                        </p>
                    </div>

                    <div className="footer-links-grid">
                        <div className="footer-group">
                            <h3>روابط سريعة</h3>
                            <ul>
                                <li><a href="#">سياسة الخصوصية</a></li>
                                <li><a href="#">شروط الاستخدام</a></li>
                                <li><a href="#">الأرشيف الصحفي</a></li>
                                <li><a href="#">خريطة الموقع</a></li>
                            </ul>
                        </div>
                        <div className="footer-group">
                            <h3>أقسام الكلية</h3>
                            <ul>
                                <li><a href="#">نظم التحكم</a></li>
                                <li><a href="#">علوم الحاسوب</a></li>
                                <li><a href="#">الهندسة الكهربائية</a></li>
                                <li><a href="#">تقنية المعلومات</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-contact">
                        <h3>تواصل معنا</h3>
                        <div className="social-actions">
                            <div className="social-circle" title="مشاركة"><Share2 size={18} /></div>
                            <div className="social-circle" title="البريد"><Mail size={18} /></div>
                        </div>
                    </div>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-bottom">
                    <p>© 2026 جميع الحقوق محفوظة لجامعة  - المركز الإعلامي</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

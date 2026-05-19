import { NavLink, Outlet } from 'react-router-dom';
import './PublisherLayout.css';

const PublisherLayout = () => {
  return (
    <div className="publisher-layout">
      <aside className="publisher-sidebar">
        <h2>لوحة الناشر</h2>
        <nav>
          <NavLink to="/publisher" end>🏠 لوحة التحكم</NavLink>
          <NavLink to="/publisher/news">📰 أخبار الكلية</NavLink>
          <NavLink to="/publisher/announcement">📢 الإعلانات</NavLink>
          <NavLink to="/publisher/article">📄 المقالات العلمية</NavLink>
          <NavLink to="/publisher/messages">✉️ اتصل بنا</NavLink>
          <NavLink to="/" target="_blank" style={{ marginTop: '20px', backgroundColor: 'rgba(0,0,0,0.2)' }}>🌐 العودة للموقع</NavLink>
        </nav>
      </aside>
      <main className="publisher-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PublisherLayout;


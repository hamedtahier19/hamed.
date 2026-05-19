import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header'
import Footer from './components/Footer';
import NewsTicker from './components/NewsTicker';
import Home from './pages/Home';
import FacultyNews from './pages/FacultyNews';
import Announcements from './pages/Announcements';
import ScientificArticles from './pages/ScientificArticles';
import Contact from './pages/Contact';
import NewsDetails from './pages/NewsDetails';


// استيراد صفحات وصف الواجهة الخاصة بالناشر
import PublisherLayout from './layouts/PublisherLayout';
import Dashboard from './pages/publisher/Dashboard';
import PublishNews from './pages/publisher/PublishNews';
import PublishArticle from './pages/publisher/PublishArticle';
import PublishAnnouncement from './pages/publisher/PublishAnnouncement';
import PublishProject from './pages/publisher/PublishProject';
import ManageContact from './pages/publisher/ManageContact';

// تخطيط قسم القارئ
const ReaderLayout = () => (
  <>
    <Header />
    <NewsTicker />
    <main style={{ minHeight: '80vh' }}>
      <Outlet />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* مسارات قسم القارئ */}
          <Route path="/" element={<ReaderLayout />}>
            <Route index element={<Home />} />
            <Route path="news" element={<FacultyNews />} />
            <Route path="news/:id" element={<NewsDetails />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="announcements/:id" element={<NewsDetails endpoint="announcements.php" basePath="/announcements" backTitle="الإعلانات" />} />

            <Route path="articles" element={<ScientificArticles />} />
            <Route path="articles/:id" element={<NewsDetails endpoint="articles.php" basePath="/articles" backTitle="المقالات العلمية" />} />
            <Route path="projects/:id" element={<NewsDetails endpoint="projects.php" basePath="/articles" backTitle="الأبحاث ومشاريع التخرج" />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* مسارات قسم الناشر */}
          <Route path="/publisher" element={<PublisherLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="news" element={<PublishNews />} />
            <Route path="article" element={<PublishArticle />} />
            <Route path="announcement" element={<PublishAnnouncement />} />
            <Route path="project" element={<PublishProject />} />
            <Route path="messages" element={<ManageContact />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App

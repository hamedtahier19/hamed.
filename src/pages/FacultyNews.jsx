import NewsGrid from '../components/NewsGrid';

const FacultyNews = () => {
    return (
        <div className="container page-container">
            <header className="page-header">
                <h1 className="page-title">أخبار الكلية</h1>
                <p className="page-subtitle">آخر التحديثات والإنجازات في حرمنا الأكاديمي.</p>
            </header>
            <NewsGrid endpoint="news.php" defaultCategory="أخبار الكلية" />
        </div>
    );
};

export default FacultyNews;

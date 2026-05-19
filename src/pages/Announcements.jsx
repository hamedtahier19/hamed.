import NewsGrid from '../components/NewsGrid';

const Announcements = () => {
    return (
        <div className="container page-container">
            <header className="page-header">
                <h1 className="page-title">الإعلانات والفعاليات</h1>
                <p className="page-subtitle">
                    ابق على اطلاع دائم بأحدث الأنشطة الأكاديمية والفعاليات الجامعية في صرحنا التعليمي المتميز.
                </p>
            </header>
            <NewsGrid endpoint="announcements.php" defaultCategory="إعلانات" detailsPathPrefix="/announcements" />
        </div>
    );
};

export default Announcements;

import Hero from '../components/Hero';
import NewsGrid from '../components/NewsGrid';

const Home = () => {
    return (
        <main>
            <Hero />

            <div className="container" style={{ paddingTop: '5rem' }}>
                {/* News Section */}
                <div className="home-section">
                    <NewsGrid
                        endpoint="news.php"
                        defaultCategory="أخبار الكلية"
                        title="أخبار الكلية"
                        viewAllPath="/news"
                    />
                </div>

                {/* Announcements Section */}
                <div className="home-section">
                    <NewsGrid
                        endpoint="announcements.php"
                        defaultCategory="الفعاليات والإعلانات"
                        title="الإعلانات والفعاليات"
                        viewAllPath="/announcements"
                        detailsPathPrefix="/announcements"
                    />
                </div>

                {/* Scientific Articles Section */}
                <div className="home-section" style={{ marginBottom: '8rem' }}>
                    <NewsGrid
                        endpoint="articles.php"
                        defaultCategory="مقالات علمية"
                        title="المقالات العلمية والأبحاث"
                        viewAllPath="/articles"
                        detailsPathPrefix="/articles"
                    />
                </div>
            </div>
        </main>
    );
};

export default Home;

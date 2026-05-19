import NewsGrid from '../components/NewsGrid';

const ScientificArticles = () => {
    return (
        <div className="container page-container">
            <header className="page-header">
                <h1 className="page-title">المقالات العلمية والأبحاث</h1>
                <p className="page-subtitle">اكتشف أحدث النتاجات المعرفية والأبحاث المتميزة لأعضاء هيئة التدريس والطلاب.</p>
            </header>

            <section className="mb-12" style={{ marginBottom: '5rem' }}>
                <NewsGrid endpoint="articles.php" defaultCategory="مقالات علمية" title="مقالات علمية مختارة" detailsPathPrefix="/articles" />
            </section>

            <section className="mb-12">
                <NewsGrid endpoint="projects.php" defaultCategory="أبحاث التخرج" title="مشاريع وأبحاث التخرج" detailsPathPrefix="/projects" />
            </section>
        </div>
    );
};

export default ScientificArticles;

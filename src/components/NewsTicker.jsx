import './NewsTicker.css';

const NewsTicker = () => {
    return (
        <div className="news-ticker">
            <div className="container ticker-content">
                <span className="ticker-badge">عاجل</span>
                <div className="ticker-text-wrapper">
                    <p className="ticker-text">
                        هنا تبدأ المعرفة… وهنا تُصنع الإنجازات
                        تابع أخبار الكلية، فعالياتها، وأحدث الأبحاث العلمية في منصة واحدة
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NewsTicker;

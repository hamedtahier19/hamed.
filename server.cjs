/**
 * server.cjs — سيرفر Node.js/Express يُغني عن XAMPP تمامًا
 * يستخدم قاعدة بيانات MySQL سحابية على منصة Aiven لحفظ البيانات للأبد
 * يُشغَّل بالأمر: npm run server
 */

const express = require('express');
const mysql   = require('mysql2/promise');
const cors    = require('cors');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 8000;

app.enable('trust proxy');
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// ――― إعداد رفع الملفات ―――
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// تقديم الصور المرفوعة كملفات ثابتة
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ――― اتصال MySQL السحابي ―――
let dbConfig = {
    host:     process.env.DB_HOST || 'localhost',
    port:     parseInt(process.env.DB_PORT) || 3306,
    user:     process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'college_db',
    ssl:      false
};

const configPath = path.join(__dirname, 'db_config.json');
if (fs.existsSync(configPath)) {
    try {
        const localConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        dbConfig = {
            host:     localConfig.DB_HOST || dbConfig.host,
            port:     parseInt(localConfig.DB_PORT) || dbConfig.port,
            user:     localConfig.DB_USER || dbConfig.user,
            password: localConfig.DB_PASSWORD || dbConfig.password,
            database: localConfig.DB_NAME || dbConfig.database,
            ssl:      localConfig.DB_SSL === true ? { rejectUnauthorized: false } : dbConfig.ssl
        };
    } catch (e) {
        console.error('Error loading db_config.json:', e.message);
    }
} else if (process.env.DB_HOST) {
    dbConfig = {
        host:     process.env.DB_HOST,
        port:     parseInt(process.env.DB_PORT) || 3306,
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl:      process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    };
}

const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
});

// تهيئة الجداول تلقائياً
(async () => {
    try {
        const conn = await pool.getConnection();
        console.log('✅ متصل بقاعدة بيانات MySQL السحابية على Aiven بنجاح!');
        conn.release();

        // 1. جدول المستخدمين (Users)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'editor', 'student') DEFAULT 'student',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        `);

        // 2. جدول الأخبار (News)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS news (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                summary TEXT,
                content TEXT,
                image VARCHAR(255),
                file_url VARCHAR(255),
                author_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        `);

        // 3. جدول الإعلانات (Announcements)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS announcements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                image VARCHAR(255),
                file_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        `);

        // 4. جدول المقالات (Articles)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS articles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                summary TEXT,
                content TEXT,
                author_id INT,
                image VARCHAR(255),
                file_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        `);

        // 5. جدول مشاريع التخرج (Projects)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                student_name VARCHAR(255) NOT NULL,
                year INT NOT NULL,
                image VARCHAR(255),
                file_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        `);

        // 6. جدول التواصل (Messages)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        `);
        
        console.log('✅ جميع الجداول جاهزة في قاعدة البيانات السحابية!');
    } catch (err) {
        console.error('❌ فشل الاتصال بقاعدة البيانات السحابية أو تهيئة الجداول:', err.message);
    }
})();

// ――― Helper: يُسجّل كل route مع وبدون .php ―――
const route = (app, method, path, ...handlers) => {
    app[method](path, ...handlers);
    app[method](path.replace('.php', ''), ...handlers);
};


// ――― رفع الصور والملفات ―――
route(app, 'post', '/api/upload.php', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
});

route(app, 'post', '/api/upload-file.php', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
});

// ――― أخبار الكلية ―――
route(app, 'get', '/api/news.php', async (req, res) => {
    const { id } = req.query;
    try {
        if (id) {
            const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
            res.json(rows[0] || { error: 'Not found' });
        } else {
            const [rows] = await pool.query('SELECT * FROM news ORDER BY created_at DESC');
            res.json(rows);
        }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

route(app, 'post', '/api/news.php', async (req, res) => {
    const { title, summary, content, image, file_url } = req.body;
    try {
        await pool.query('INSERT INTO news (title, summary, content, image, file_url, author_id) VALUES (?,?,?,?,?,?)',
            [title, summary || '', content, image || null, file_url || null, 1]);
        res.status(201).json({ status: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

route(app, 'put', '/api/news.php', async (req, res) => {
    const { id, title, summary, content, image, file_url } = req.body;
    try {
        await pool.query('UPDATE news SET title=?, summary=?, content=?, image=?, file_url=? WHERE id=?',
            [title, summary || '', content, image || null, file_url || null, id]);
        res.json({ status: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

route(app, 'delete', '/api/news.php', async (req, res) => {
    const { id } = req.body;
    try {
        await pool.query('DELETE FROM news WHERE id = ?', [id]);
        res.json({ status: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ――― الإعلانات ―――
route(app, 'get', '/api/announcements.php', async (req, res) => {
    const { id } = req.query;
    try {
        if (id) {
            const [rows] = await pool.query('SELECT * FROM announcements WHERE id = ?', [id]);
            res.json(rows[0] || { error: 'Not found' });
        } else {
            const [rows] = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
            res.json(rows);
        }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

route(app, 'post', '/api/announcements.php', async (req, res) => {
    const { title, content, image, file_url } = req.body;
    try {
        await pool.query('INSERT INTO announcements (title, content, image, file_url) VALUES (?,?,?,?)',
            [title, content, image || null, file_url || null]);
        res.status(201).json({ status: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ――― المقالات العلمية ―――
route(app, 'get', '/api/articles.php', async (req, res) => {
    const { id } = req.query;
    try {
        if (id) {
            const [rows] = await pool.query(`
                SELECT a.*, u.name AS author_name
                FROM articles a
                LEFT JOIN users u ON a.author_id = u.id
                WHERE a.id = ?
            `, [id]);
            res.json(rows[0] || { error: 'Not found' });
        } else {
            const [rows] = await pool.query(`
                SELECT a.*, u.name AS author_name
                FROM articles a
                LEFT JOIN users u ON a.author_id = u.id
                ORDER BY a.created_at DESC
            `);
            res.json(rows);
        }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

route(app, 'post', '/api/articles.php', async (req, res) => {
    const { title, summary, content, image, file_url, author_id } = req.body;
    try {
        await pool.query(
            'INSERT INTO articles (title,summary,content,image,file_url,author_id) VALUES (?,?,?,?,?,?)',
            [title, summary, content, image || null, file_url || null, author_id || 1]
        );
        res.status(201).json({ status: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ――― مشاريع التخرج ―――
route(app, 'get', '/api/projects.php', async (req, res) => {
    const { id } = req.query;
    try {
        if (id) {
            const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
            res.json(rows[0] || { error: 'Not found' });
        } else {
            const [rows] = await pool.query('SELECT * FROM projects ORDER BY year DESC, created_at DESC');
            res.json(rows);
        }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

route(app, 'post', '/api/projects.php', async (req, res) => {
    const { title, description, student_name, year, image } = req.body;
    try {
        await pool.query(
            'INSERT INTO projects (title,description,student_name,year,image) VALUES (?,?,?,?,?)',
            [title, description, student_name, year, image || null]
        );
        res.status(201).json({ status: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ――― رسائل اتصل بنا ―――
route(app, 'get', '/api/messages.php', async (_req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

route(app, 'post', '/api/messages.php', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await pool.query('INSERT INTO messages (name,email,message) VALUES (?,?,?)',
            [name, email, message]);
        res.status(201).json({ status: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ――― معالجة الأخطاء ―――
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ success: false, message: err.message });
});

// ――― تشغيل ―――
app.listen(PORT, () => {
    console.log(`\n🚀 السيرفر يعمل على http://localhost:${PORT}`);
    console.log(`📡 اختبر الـ API: http://localhost:${PORT}/api/news.php\n`);
});

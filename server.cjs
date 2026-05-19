/**
 * server.cjs — سيرفر Node.js/Express يُغني عن XAMPP تمامًا
 * يستخدم قاعدة بيانات SQLite (بدون الحاجة لأي برامج خارجية)
 * يُشغَّل بالأمر: npm run server
 */

const express = require('express');
const sqlite3 = require('sqlite3');
const { open }  = require('sqlite');
const cors    = require('cors');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// ――― إعداد رفع الملفات ―――
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads'); // تم تغيير المسار ليكون داخل المجلد الحالي
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

// ――― اتصال SQLite وإنشاء الجداول ―――
let db;
(async () => {
    try {
        db = await open({
            filename: path.join(__dirname, 'database.sqlite'),
            driver: sqlite3.Database
        });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'student',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS news (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                summary TEXT,
                content TEXT,
                image TEXT,
                file_url TEXT,
                author_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS announcements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT,
                image TEXT,
                file_url TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                summary TEXT,
                content TEXT,
                author_id INTEGER,
                image TEXT,
                file_url TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                student_name TEXT NOT NULL,
                year INTEGER NOT NULL,
                image TEXT,
                file_url TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ SQLite متصل وقاعدة البيانات جاهزة (ملف database.sqlite)!');
    } catch (err) {
        console.error('❌ فشل الاتصال بقاعدة بيانات SQLite:', err.message);
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
    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
});

route(app, 'post', '/api/upload-file.php', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
});

// ――― أخبار الكلية ―――
route(app, 'get', '/api/news.php', async (req, res) => {
    const { id } = req.query;
    try {
        if (id) {
            const row = await db.get('SELECT * FROM news WHERE id = ?', [id]);
            res.json(row || { error: 'Not found' });
        } else {
            const rows = await db.all('SELECT * FROM news ORDER BY created_at DESC');
            res.json(rows);
        }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

route(app, 'post', '/api/news.php', async (req, res) => {
    const { title, summary, content, image, file_url } = req.body;
    try {
        await db.run('INSERT INTO news (title, summary, content, image, file_url, author_id) VALUES (?,?,?,?,?,?)',
            [title, summary || '', content, image || null, file_url || null, 1]);
        res.status(201).json({ status: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

route(app, 'put', '/api/news.php', async (req, res) => {
    const { id, title, summary, content, image, file_url } = req.body;
    try {
        await db.run('UPDATE news SET title=?, summary=?, content=?, image=?, file_url=? WHERE id=?',
            [title, summary || '', content, image || null, file_url || null, id]);
        res.json({ status: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

route(app, 'delete', '/api/news.php', async (req, res) => {
    const { id } = req.body;
    try {
        await db.run('DELETE FROM news WHERE id = ?', [id]);
        res.json({ status: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ――― الإعلانات ―――
route(app, 'get', '/api/announcements.php', async (_req, res) => {
    try {
        const rows = await db.all('SELECT * FROM announcements ORDER BY created_at DESC');
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

route(app, 'post', '/api/announcements.php', async (req, res) => {
    const { title, content, image, file_url } = req.body;
    try {
        await db.run('INSERT INTO announcements (title, content, image, file_url) VALUES (?,?,?,?)',
            [title, content, image || null, file_url || null]);
        res.status(201).json({ status: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ――― المقالات العلمية ―――
route(app, 'get', '/api/articles.php', async (_req, res) => {
    try {
        const rows = await db.all(`
            SELECT a.*, u.name AS author_name
            FROM articles a
            LEFT JOIN users u ON a.author_id = u.id
            ORDER BY a.created_at DESC
        `);
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

route(app, 'post', '/api/articles.php', async (req, res) => {
    const { title, summary, content, image, file_url, author_id } = req.body;
    try {
        await db.run(
            'INSERT INTO articles (title,summary,content,image,file_url,author_id) VALUES (?,?,?,?,?,?)',
            [title, summary, content, image || null, file_url || null, author_id || 1]
        );
        res.status(201).json({ status: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ――― مشاريع التخرج ―――
route(app, 'get', '/api/projects.php', async (_req, res) => {
    try {
        const rows = await db.all('SELECT * FROM projects ORDER BY year DESC, created_at DESC');
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

route(app, 'post', '/api/projects.php', async (req, res) => {
    const { title, description, student_name, year, image } = req.body;
    try {
        await db.run(
            'INSERT INTO projects (title,description,student_name,year,image) VALUES (?,?,?,?,?)',
            [title, description, student_name, year, image || null]
        );
        res.status(201).json({ status: 'success' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ――― رسائل اتصل بنا ―――
route(app, 'get', '/api/messages.php', async (_req, res) => {
    try {
        const rows = await db.all('SELECT * FROM messages ORDER BY created_at DESC');
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

route(app, 'post', '/api/messages.php', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await db.run('INSERT INTO messages (name,email,message) VALUES (?,?,?)',
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

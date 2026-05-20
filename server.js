/**
 * server.js — سيرفر Node.js/Express يُغني عن XAMPP
 * يشغّل الباك-إند مباشرة بدون PHP
 * 
 * للتشغيل: node server.js
 */

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 8000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- إعداد الاتصال بقاعدة البيانات ---
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',         // كلمة مرور MySQL (اتركيها فارغة إذا لم تضعي كلمة مرور)
    database: 'college_db',
    waitForConnections: true,
    connectionLimit: 10,
});

// --- اختبار الاتصال ---
pool.getConnection()
    .then(conn => {
        console.log('✅ اتصال بقاعدة البيانات ناجح!');
        conn.release();
    })
    .catch(err => {
        console.error('❌ فشل الاتصال بقاعدة البيانات:', err.message);
        console.error('💡 تأكدي من تشغيل MySQL (XAMPP أو MySQL Workbench)');
    });

// ==========================================
// API: أخبار الكلية  GET /api/news.php
// ==========================================
app.get('/api/news.php', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM news ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/news.php', async (req, res) => {
    const { title, content, image } = req.body;
    try {
        await pool.query(
            'INSERT INTO news (title, content, image) VALUES (?, ?, ?)',
            [title, content, image || null]
        );
        res.status(201).json({ status: 'success', message: 'تم نشر الخبر بنجاح' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// API: الإعلانات  GET/POST /api/announcements.php
// ==========================================
app.get('/api/announcements.php', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/announcements.php', async (req, res) => {
    const { title, content } = req.body;
    try {
        await pool.query(
            'INSERT INTO announcements (title, content) VALUES (?, ?)',
            [title, content]
        );
        res.status(201).json({ status: 'success', message: 'تم نشر الإعلان بنجاح' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/announcements.php', async (req, res) => {
    const { id, title, content } = req.body;
    try {
        await pool.query(
            'UPDATE announcements SET title=?, content=? WHERE id=?',
            [title, content, id]
        );
        res.json({ status: 'success', message: 'تم تحديث الإعلان بنجاح' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/announcements.php', async (req, res) => {
    const { id } = req.body;
    try {
        await pool.query('DELETE FROM announcements WHERE id=?', [id]);
        res.json({ status: 'success', message: 'تم حذف الإعلان بنجاح' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// API: المقالات العلمية  GET/POST/PUT/DELETE /api/articles.php
// ==========================================
app.get('/api/articles.php', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT articles.*, users.name as author_name
            FROM articles
            LEFT JOIN users ON articles.author_id = users.id
            ORDER BY articles.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/articles.php', async (req, res) => {
    const { title, summary, content, image, author_id } = req.body;
    try {
        await pool.query(
            'INSERT INTO articles (title, summary, content, image, author_id) VALUES (?, ?, ?, ?, ?)',
            [title, summary, content, image || null, author_id || 1]
        );
        res.status(201).json({ status: 'success', message: 'تم نشر المقال بنجاح' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/articles.php', async (req, res) => {
    const { id, title, summary, content, image } = req.body;
    try {
        await pool.query(
            'UPDATE articles SET title=?, summary=?, content=?, image=? WHERE id=?',
            [title, summary || '', content, image || null, id]
        );
        res.json({ status: 'success', message: 'تم تحديث المقال بنجاح' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/articles.php', async (req, res) => {
    const { id } = req.body;
    try {
        await pool.query('DELETE FROM articles WHERE id=?', [id]);
        res.json({ status: 'success', message: 'تم حذف المقال بنجاح' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// API: رسائل اتصل بنا  GET/POST /api/messages.php
// ==========================================
app.get('/api/messages.php', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/messages.php', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await pool.query(
            'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
            [name, email, message]
        );
        res.status(201).json({ status: 'success', message: 'تم إرسال رسالتك بنجاح' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- تشغيل السيرفر ---
app.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل على: http://localhost:${PORT}`);
    console.log(`📡 API متوفّر على: http://localhost:${PORT}/api/`);
    console.log(`\n📋 الـ endpoints المتاحة:`);
    console.log(`   GET/POST http://localhost:${PORT}/api/news.php`);
    console.log(`   GET/POST http://localhost:${PORT}/api/announcements.php`);
    console.log(`   GET/POST http://localhost:${PORT}/api/articles.php`);
    console.log(`   GET/POST http://localhost:${PORT}/api/messages.php`);
});

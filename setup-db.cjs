/**
 * setup-db.cjs — ينشئ قاعدة البيانات والجداول تلقائيًا
 * التشغيل: node setup-db.cjs
 */

const mysql = require('mysql2/promise');
const fs    = require('fs');
const path  = require('path');

async function setup() {
    let conn;
    try {
        // اتصال بدون تحديد قاعدة بيانات لإنشائها
        conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',   // ← غيّري إذا لزم
            multipleStatements: true,
        });

        console.log('✅ متصل بـ MySQL');

        // قراءة schema.sql
        const schemaPath = path.join(__dirname, 'backend', 'schema.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');

        // تنفيذ جميع الاستعلامات
        await conn.query(sql);
        console.log('✅ تم إنشاء قاعدة البيانات college_db والجداول بنجاح!');
        console.log('🚀 الآن شغّلي: npm run server');
    } catch (err) {
        console.error('❌ خطأ:', err.message);
    } finally {
        if (conn) await conn.end();
    }
}

setup();

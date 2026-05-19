// تحديد عنوان الـ API تلقائياً بناءً على وضع التشغيل
const API_BASE_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:8000/api"
        : "https://moom22.hstn.me/backend/api";

export default API_BASE_URL;
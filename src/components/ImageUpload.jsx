import { useState } from 'react';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

const ImageUpload = ({ onUploadSuccess, currentImage }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage || null);
    const [status, setStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // ✅ تم تعديل هذه الدالة لاستخدام FormData بدلاً من Base64
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // معاينة محلية فورية
        const localPreview = URL.createObjectURL(file);
        setPreview(localPreview);

        // التحقق من الحجم
        if (file.size > 25 * 1024 * 1024) {
            setStatus('error');
            setErrorMessage('حجم الملف كبير جداً (25MB كحد أقصى)');
            return;
        }

        setUploading(true);
        setStatus(null);
        setErrorMessage('');

        // استخدام FormData بدلاً من Base64 (أفضل لرفع الملفات)
        const formData = new FormData();
        formData.append('file', file);  // يجب أن يكون الاسم 'file' كما في upload.php

        try {
            const response = await fetch(`${API_BASE_URL}/upload.php`, {
                method: 'POST',
                body: formData  // لا نضع headers، FormData يحددها تلقائياً
            });

            const data = await response.json();
            if (data.success) {
                setStatus('success');
                onUploadSuccess(data.url);
            } else {
                throw new Error(data.message || 'فشل الرفع');
            }
        } catch (error) {
            console.error("Upload Error:", error);
            setStatus('error');
            setErrorMessage(error.message);
            // إزالة المعاينة في حالة الفشل
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const clearImage = () => {
        setPreview(null);
        setStatus(null);
        onUploadSuccess('');
    };

    return (
        <div className="image-upload-container" style={{
            border: '2px dashed #ddd',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            background: '#f9f9f9',
            position: 'relative'
        }}>
            {preview ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={preview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '180px', borderRadius: '8px' }} />
                    <button
                        type="button"
                        onClick={clearImage}
                        style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '-10px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={14} />
                    </button>
                    {status === 'success' && (
                        <div style={{ color: '#28a745', fontSize: '12px', marginTop: '8px' }}>
                            <CheckCircle size={14} /> تم الرفع بنجاح
                        </div>
                    )}
                </div>
            ) : (
                <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    {uploading ? (
                        <Loader2 size={32} className="animate-spin" color="#0d6efd" />
                    ) : (
                        <Upload size={32} color="#666" />
                    )}
                    <span>{uploading ? 'جاري الرفع...' : 'اختر صورة من جهازك'}</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} disabled={uploading} />
                </label>
            )}
            {status === 'error' && <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '10px' }}>{errorMessage}</p>}
        </div>
    );
};

export default ImageUpload;
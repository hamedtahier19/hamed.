import { useState } from 'react';
import { FileText, X, CheckCircle, Loader2, Upload } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

const FileUpload = ({ onUploadSuccess, currentFile }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentFile || null);
    const [status, setStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 25 * 1024 * 1024) {
            setStatus('error');
            setErrorMessage('حجم الملف كبير جداً (الحد الأقصى 25 ميجابايت)');
            return;
        }

        setUploading(true);
        setStatus(null);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            // ✅ استخدام upload.php بدلاً من upload-file.php
            const response = await fetch(`${API_BASE_URL}/upload.php`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                let msg = `خطأ في السيرفر (${response.status})`;
                try {
                    const errorData = JSON.parse(errorText);
                    msg = errorData.message || msg;
                } catch (e) { }
                throw new Error(msg);
            }

            const data = await response.json();
            if (data.success) {
                setStatus('success');
                setPreview(data.url);
                onUploadSuccess(data.url);
            } else {
                throw new Error(data.message || 'فشل الرفع');
            }
        } catch (error) {
            console.error("Upload Error Details:", error);
            setStatus('error');
            setErrorMessage(error.message === 'Failed to fetch' ? 'تعذر الاتصال بالسيرفر.' : error.message);
        } finally {
            setUploading(false);
        }
    };

    const clearFile = () => {
        setPreview(null);
        setStatus(null);
        onUploadSuccess('');
    };

    return (
        <div className="file-upload-container" style={{
            border: '2px dashed #ddd',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            background: '#f9f9f9',
            position: 'relative',
            transition: 'all 0.3s ease'
        }}>
            {preview ? (
                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#fff', padding: '10px 15px', borderRadius: '8px', border: '1px solid #eee' }}>
                    <FileText size={24} color="#0d6efd" />
                    <span style={{ fontSize: '14px', color: '#333', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        تم رفع الملف بنجاح
                    </span>
                    <button
                        type="button"
                        onClick={clearFile}
                        style={{ background: 'transparent', color: '#dc3545', border: 'none', cursor: 'pointer', padding: '4px' }}
                    >
                        <X size={18} />
                    </button>
                    {status === 'success' && (
                        <div style={{ position: 'absolute', bottom: '-25px', left: '50%', transform: 'translateX(-50%)', color: '#28a745', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500', width: 'max-content' }}>
                            <CheckCircle size={14} /> تم الرفع بنجاح
                        </div>
                    )}
                </div>
            ) : (
                <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '10px' }}>
                    {uploading ? (
                        <Loader2 size={32} className="animate-spin" color="#0d6efd" />
                    ) : (
                        <Upload size={32} color="#666" />
                    )}
                    <span style={{ color: '#666', fontWeight: '500' }}>
                        {uploading ? 'جاري رفع الملف...' : 'اضغطي هنا لاختيار ملف خارجي (PDF/Word/...)'}
                    </span>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        disabled={uploading}
                    />
                </label>
            )}
            {status === 'error' && (
                <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '10px', fontWeight: '500' }}>
                    ❌ {errorMessage}
                </p>
            )}
        </div>
    );
};

export default FileUpload;
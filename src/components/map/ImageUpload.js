import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';

const MAX_SIZE_MB = 3;

/**
 * ImageUpload — optional single-image picker with preview.
 * Converts to base64 (resized) and passes it via onChange(base64String | null).
 */
export default function ImageUpload({ value, onChange }) {
  const [preview, setPreview] = useState(value || null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const resizeAndEncode = (file) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) return reject('Please upload an image file');
      if (file.size > MAX_SIZE_MB * 1024 * 1024) return reject(`Image must be under ${MAX_SIZE_MB}MB`);

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Resize down to max 900px wide to keep base64 size reasonable
          const maxWidth = 900;
          const scale = Math.min(1, maxWidth / img.width);
          const canvas = document.createElement('canvas');
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = () => reject('Could not read image');
        img.src = e.target.result;
      };
      reader.onerror = () => reject('Could not read file');
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (file) => {
    if (!file) return;
    try {
      const dataUrl = await resizeAndEncode(file);
      setPreview(dataUrl);
      onChange(dataUrl);
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Upload failed');
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }}
        onChange={e => handleFile(e.target.files?.[0])} />

      {preview ? (
        <div style={{ position:'relative', borderRadius:'12px', overflow:'hidden', border:'1.5px solid var(--border)' }}>
          <img src={preview} alt="Vehicle preview" style={{ width:'100%', height:'180px', objectFit:'cover', display:'block' }} />
          <button type="button" onClick={handleRemove}
            style={{ position:'absolute', top:'10px', right:'10px', background:'rgba(15,23,42,.75)', color:'#fff', border:'none', borderRadius:'8px', padding:'6px 12px', fontSize:'12px', cursor:'pointer', fontWeight:'500' }}>
            ✕ Remove
          </button>
          <div onClick={() => inputRef.current?.click()}
            style={{ position:'absolute', bottom:'10px', right:'10px', background:'rgba(15,23,42,.75)', color:'#fff', border:'none', borderRadius:'8px', padding:'6px 12px', fontSize:'12px', cursor:'pointer', fontWeight:'500' }}>
            Change photo
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
          style={{
            border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius:'12px', padding:'32px 20px', textAlign:'center', cursor:'pointer',
            background: dragOver ? 'rgba(16,185,129,.05)' : 'var(--light)', transition:'.2s'
          }}>
          <div style={{ fontSize:'32px', marginBottom:'8px' }}>📷</div>
          <div style={{ fontSize:'14px', fontWeight:'600', marginBottom:'4px' }}>Click to upload a photo</div>
          <div style={{ fontSize:'12px', color:'var(--muted)' }}>or drag and drop · JPG/PNG, up to {MAX_SIZE_MB}MB · Optional</div>
        </div>
      )}
    </div>
  );
}

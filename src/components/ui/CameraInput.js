// src/components/ui/CameraInput.js
import React from 'react';
import { useRef, useState } from 'react';

export default function CameraInput({ onCapture }) {
  const videoRef = useRef(null);
  const [photo, setPhoto] = useState(null);

  // Abrir cámara
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (e) {
      alert('No se pudo acceder a la cámara: ' + e.message);
    }
  }

  // Tomar foto desde la cámara
  function takePhoto() {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL('image/png');
    setPhoto(url);
    if (onCapture) onCapture(url, null); // null porque no hay archivo físico
  }

  // Seleccionar archivo desde disco
  function handleFile(e) {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
      if (onCapture) onCapture(url, file);
    }
  }

  return (
    <div className="feature">
      <h3>Foto de la tarea</h3>

      {/* Cámara en vivo */}
      <video ref={videoRef} width="240" height="180" style={{ borderRadius: 8 }} />

      <div style={{ marginTop: 10 }}>
        <button onClick={startCamera}>Abrir cámara</button>
        <button onClick={takePhoto} style={{ marginLeft: 5 }}>Tomar foto</button>
      </div>

      {/* Selector de archivo */}
      <input type="file" accept="image/*" onChange={handleFile} style={{ marginTop: 10 }} />

      {/* Vista previa */}
      {photo && <img src={photo} alt="Preview" style={{ marginTop: 10, width: 240, borderRadius: 8 }} />}
    </div>
  );
}


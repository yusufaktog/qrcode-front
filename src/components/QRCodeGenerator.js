import React, { useState } from 'react';
import axios from 'axios';

const QRCodeGenerator = () => {
  const [text, setText] = useState('');
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQRCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const params = {
        text,
        ...(width && { width }),
        ...(height && { height })
      };

      const response = await axios.get('http://localhost:8080/qr', {
        params,
        responseType: 'blob'
      });

      const imageUrl = URL.createObjectURL(response.data);
      setQrImage(imageUrl);
    } catch (err) {
      setError('Error generating QR code. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qr-generator">
      <h1>QR Code Generator</h1>
      <form onSubmit={generateQRCode}>
        <div className="form-group">
          <label>Text/URL:</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            placeholder="Enter text or URL"
          />
        </div>

        <div className="form-group">
          <label>Width (px):</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            min="64"
            max="640"
          />
        </div>

        <div className="form-group">
          <label>Height (px):</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            min="64"
            max="640"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate QR Code'}
        </button>
      </form>
      {}

      {error && <p className="error">{error}</p>}

      {qrImage && (
        <div className="qr-result">
          <h2>Generated QR Code:</h2>
          <img src={qrImage} alt="Generated QR Code" />
          <a href={qrImage} download="qrcode.png">
            Download PNG
          </a>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
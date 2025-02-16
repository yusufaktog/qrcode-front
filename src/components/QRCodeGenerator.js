import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QRCodeGenerator = () => {
  const [text, setText] = useState('');
  const [size, setSize] = useState(200);
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isWakingUp, setIsWakingUp] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "📱Your QR missed you already";
      } else {
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.title = originalTitle;
    };
  }, []);

  const generateQRCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let wakingUpTimeout;

    wakingUpTimeout = setTimeout(() => {
      setIsWakingUp(true);
    }, 1000);

    try {
      const params = {
        text,
        width: size,
        height: size
      };

      const response = await axios.get(process.env.REACT_APP_API_URL, {
        params,
        responseType: 'blob'
      });

      const imageUrl = URL.createObjectURL(response.data);

      // Regular random delay for animation
      const randomDelay = Math.floor(100 + Math.random() * 201);
      await new Promise(resolve => setTimeout(resolve, randomDelay));

      setQrImage(imageUrl);
    } catch (err) {
      setError('Error generating QR code. Please try again.');
      console.error(err);
    } finally {
      clearTimeout(wakingUpTimeout);
      setLoading(false);
      setIsWakingUp(false);
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
          <label>Size (px):</label>
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            min="36"
            max="400"
            placeholder="Default: 200px"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1 justify-center px-4 py-2 text-sm"
        >
          {loading ? 'Generating...' : 'Generate QR Code'}
        </button>
      </form>

      {isWakingUp && (
        <div className="wake-up-message bg-blue-50 text-blue-600 p-4 rounded-lg mt-4 animate-pulse">
          <p className="flex items-center gap-2">
            <span role="img" aria-label="coffee">☕</span>
            Waking up the backend service... Thank you for your patience!
          </p>
          (May take about 2 min)
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <div className="qr-result">
        <h2>Generated QR Code:</h2>
        {loading ? (
          <img
            src="/qr-code.gif"
            className="w-[200px] h-[200px] bg-white rounded-lg"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: 'white',
            }}
            alt="Loading..."
          />
        ) : qrImage && (
          <>
            <img src={qrImage} alt="Generated QR Code" />
            <a href={qrImage} download="qrcode.png">
              Download PNG
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default QRCodeGenerator;
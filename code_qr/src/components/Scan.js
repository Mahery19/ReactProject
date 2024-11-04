import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import jsQR from 'jsqr';
import './Scan.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import QRCode from 'qrcode.react';

const Scan = () => {
    const [qrData, setQrData] = useState('');

    const handleWebcamScan = (data) => {
        if (data) {
            setQrData(data.text);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0, img.width, img.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code) {
                    setQrData(code.data);
                }
            };
        };
        reader.readAsDataURL(file);
    };

    const previewStyle = {
        height: 320,
        width: 400,
    };

    return (
        <div className="scan-container">
            <h1 className="scan-title"><i>Scan QR Code</i></h1>
            <div className={`scan-content ${qrData ? 'with-data' : ''}`}>
                <div className="scan-box">
                    <h4 className="scan-instruction">Please place your code in front of the camera to scan it</h4>
                    <QrScanner
                        delay={300}
                        style={previewStyle}
                        onError={(err) => console.error(err)}
                        onScan={handleWebcamScan}
                    />
                    <label htmlFor="file-input" className="file-input-label">
                        <FontAwesomeIcon icon={faFile} className="file-input-icon" />
                        Choose a file
                    </label>
                    <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input"
                    />
                </div>
                {qrData && (
                    <div className="qr-data-container">
                        <div className="qr-item">
                            <QRCode value={qrData} size={256} className="qr-code" />
                            <div className="qr-data-text">
                                {qrData.split('\n').map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Scan;

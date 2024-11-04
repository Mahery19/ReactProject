import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import './Generate.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSun, faMoon, faTextWidth, faIdCard, faLink, faWifi, faEnvelope, faPhone, faCalendarAlt, faSms } from '@fortawesome/free-solid-svg-icons';

const Generate = () => {
    const [selectedType, setSelectedType] = useState('Text');
    const [formData, setFormData] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [showDiscardDialog, setShowDiscardDialog] = useState(false);
    const [pendingType, setPendingType] = useState(null);
    const [showCustomizeDialog, setShowCustomizeDialog] = useState(false);
    const [showWarningDialog, setShowWarningDialog] = useState(false);
    const [qrStyle, setQrStyle] = useState('Classic');
    const [qrColor, setQrColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [darkMode, setDarkMode] = useState(false);
    const [qrValue, setQrValue] = useState('QR Code will be displayed here');

    const [initialQrColor, setInitialQrColor] = useState('#000000');
    const [initialBgColor, setInitialBgColor] = useState('#ffffff');

    useEffect(() => {
        document.body.className = darkMode ? 'dark' : '';
    }, [darkMode]);

    const handleButtonClick = (type) => {
        if (Object.keys(formData).length > 0) {
            setPendingType(type);
            setShowDiscardDialog(true);
        } else {
            setSelectedType(type);
            clearFormData();
        }
    };

    const clearFormData = () => {
        setFormData({});
        setIsFormValid(false);
        setFormErrors({});
        setQrValue('QR Code will be displayed here');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        validateField(name, value);
    };

    const handleDiscard = () => {
        setSelectedType(pendingType);
        clearFormData();
        setShowDiscardDialog(false);
        setPendingType(null);
    };

    const handleCancel = () => {
        setShowDiscardDialog(false);
        setPendingType(null);
    };

    const handleCustomizeCancel = () => {
        setQrColor(initialQrColor);
        setBgColor(initialBgColor);
        setShowCustomizeDialog(false);
    };

    const handleCustomizeDone = () => {
        setShowWarningDialog(true);
    };

    const handleCustomizeOpen = () => {
        setInitialQrColor(qrColor);
        setInitialBgColor(bgColor);
        setShowCustomizeDialog(true);
    };

    const handleWarningConfirm = () => {
        setShowWarningDialog(false);
        setShowCustomizeDialog(false);
    };

    const handleWarningCancel = () => {
        setQrColor(initialQrColor);
        setBgColor(initialBgColor);
        setShowWarningDialog(false);
    };

    const validateField = (name, value) => {
        let errors = formErrors;

        switch (name) {
            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                errors.email = emailPattern.test(value) ? '' : 'Please enter a valid email address';
                break;
            case 'url':
                const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
                errors.url = urlPattern.test(value) ? '' : 'Please enter a valid URL';
                break;
            case 'phone':
            case 'phone0':
            case 'phone1':
            case 'phone2':
            case 'phone3':
            case 'phone4':
                errors[name] = /^\d+$/.test(value) ? '' : 'Please enter a valid phone number';
                break;
            case 'end':
                const startDate = new Date(formData.start);
                const endDate = new Date(value);
                errors.end = endDate < startDate ? 'End date must be after start date' : '';
                break;
            default:
                break;
        }
        setFormErrors(errors);
        validateForm(errors);
    };

    const validateForm = (errors) => {
        let isValid = true;

        switch (selectedType) {
            case 'Contact/vCard':
                isValid = !errors.email && Object.keys(formErrors).filter(key => key.startsWith('phone')).every(key => !errors[key]);
                if (!formData.name || !formData.company || !formData.email || !formData.birthdate || !formData.city) {
                    isValid = false;
                }
                break;
            case 'URL':
                isValid = !errors.url;
                if (!formData.url) {
                    isValid = false;
                }
                break;
            case 'Wireless':
                isValid = !errors.WirelessForm;
                if (!formData.ssid || !formData.security) {
                    isValid = false;
                }
                break;
            case 'E-mail':
                isValid = !errors.email;
                if (!formData.email || !formData.subject || !formData.message) {
                    isValid = false;
                }
                break;
            case 'Phone':
                isValid = !errors.phone;
                if (!formData.phone) {
                    isValid = false;
                }
                break;
            case 'Text Messages':
                isValid = !errors.phone;
                if (!formData.phone || !formData.message) {
                    isValid = false;
                }
                break;
            case 'Events':
                isValid = !errors.end;
                if (!formData.title || !formData.location || !formData.description || !formData.start || !formData.end) {
                    isValid = false;
                }
                break;
            default:
                break;
        }
        setIsFormValid(isValid);
    };

    useEffect(() => {
        if (isFormValid) {
            generateQrCode();
        } else {
            setQrValue('QR Code will be displayed here');
        }
    }, [formData, selectedType, qrStyle, qrColor, bgColor, isFormValid]);

    const generateQrCode = () => {
        let qrValue = '';
        switch (selectedType) {
            case 'Text':
                qrValue = `Text : ${formData.text || ''}`;
                break;
            case 'Contact/vCard':
                const phoneFields = Object.keys(formData)
                    .filter((key) => key.startsWith('phone'))
                    .map((key) => formData[key])
                    .join(';');
                qrValue = `
                    Contact 
                    Name : ${formData.name || ''}
                    Organisation : ${formData.company || ''}
                    Email : ${formData.email || ''}
                    Birthdate : ${formData.birthdate || ''}
                    Address : ${formData.city || ''}
                    Phone : ${phoneFields || ''}
                `;
                break;
            case 'URL':
                qrValue = `URL : ${formData.url || ''}`;
                break;
            case 'Wireless':
                qrValue = `
                    Wifi name : ${formData.ssid || ''}
                    Security type : ${formData.security || ''}
                    Password : ${formData.password || ''}
                `;
                break;
            case 'E-mail':
                qrValue = `
                    Mail to : ${formData.email || ''}
                    Subject : ${formData.subject || ''}
                    Body : ${formData.message || ''}
                `;
                break;
            case 'Phone':
                qrValue = `Phone : ${formData.phone || ''}`;
                break;
            case 'Events':
                qrValue = `
                    Title of the event : ${formData.title || ''}
                    Location : ${formData.location || ''}
                    Description : ${formData.description || ''}
                    Date start : ${formData.start || ''}
                    Date end : ${formData.end || ''}
                `;
                break;
            case 'Text Messages':
                qrValue = `
                    SMS
                    Phone : ${formData.phone || ''}
                    Body : ${formData.message || ''}
                    `;
                break;
            default:
                qrValue = '';
        }
        setQrValue(qrValue);
    };

    const downloadQrCode = () => {
        if (!isFormValid) {
            return;
        }

        const canvas = document.getElementById('qr-gen');
        if (canvas) {
            const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = 'qr-code.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    const renderForm = () => {
        switch (selectedType) {
            case 'Text':
                return (
                    <div className="form-content">
                        <h3>Text QR Code</h3>
                        <form>
                            <div className="form-group">
                                <label>Enter text</label>
                                <input type="text" name="text" onChange={handleChange} value={formData.text || ''} />
                            </div>
                        </form>
                    </div>
                );
            case 'Contact/vCard':
                return (
                    <div className="form-content">
                        <h3>Contact/vCard QR Code</h3>
                        <form>
                            <div className="form-group">
                                <label>Enter name</label>
                                <input type="text" name="name" onChange={handleChange} value={formData.name || ''} />
                            </div>
                            <div className="form-group">
                                <label>Enter company</label>
                                <input type="text" name="company" onChange={handleChange} value={formData.company || ''} />
                            </div>
                            <div className="form-group">
                                <label>Enter your email</label>
                                <input type="email" name="email" onChange={handleChange} value={formData.email || ''} />
                                {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                            </div>
                            <div className="form-group">
                                <label>Enter your date of birth</label>
                                <input type="date" name="birthdate" onChange={handleChange} value={formData.birthdate || ''} max="2023-12-31" />
                            </div>
                            <div className="form-group">
                                <label>Enter city</label>
                                <select name="city" onChange={handleChange} value={formData.city || ''} className="short-select">
                                    <option value="">Select a city</option>
                                    <option value="ANTANANARIVO (101)">ANTANANARIVO</option>
                                    <option value="ANTSIRANANA (201)">ANTSIRANANA</option>
                                    <option value="FIANARANTSOA (301)">FIANARANTSOA</option>
                                    <option value="MAHAJANGA (401)">MAHAJANGA</option>
                                    <option value="TOAMASINA (501)">TOAMASINA</option>
                                    <option value="TOLIARY (601)">TOLIARY</option>
                                </select>
                            </div>
                            <PhoneNumberFields formData={formData} handleChange={handleChange} formErrors={formErrors} />
                        </form>
                    </div>
                );
            case 'URL':
                return (
                    <div className="form-content">
                        <h3>URL QR Code</h3>
                        <form>
                            <div className="form-group">
                                <label>Enter URL</label>
                                <input type="url" name="url" placeholder="For e.g.- https://example.com/" onChange={handleChange} value={formData.url || ''} />
                                {formErrors.url && <span className="error-message">{formErrors.url}</span>}
                            </div>
                        </form>
                    </div>
                );
            case 'Wireless':
                return <WirelessForm formData={formData} handleChange={handleChange} />;
            case 'E-mail':
                return (
                    <div className="form-content">
                        <h3>Email QR Code</h3>
                        <form>
                            <div className="form-group">
                                <label>Enter your Email</label>
                                <input type="email" name="email" onChange={handleChange} value={formData.email || ''} />
                                {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                            </div>
                            <div className="form-group">
                                <label>Enter subject</label>
                                <input type="text" name="subject" onChange={handleChange} value={formData.subject || ''} />
                            </div>
                            <div className="form-group">
                                <label>Enter message</label>
                                <textarea name="message" onChange={handleChange} value={formData.message || ''} required></textarea>
                            </div>
                        </form>
                    </div>
                );
            case 'Phone':
                return (
                    <div className="form-content">
                        <h3>Phone QR Code</h3>
                        <form>
                            <div className="form-group">
                                <label>Enter telephone number</label>
                                <input type="tel" name="phone" onChange={handleChange} value={formData.phone || ''} />
                                {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                            </div>
                        </form>
                    </div>
                );
            case 'Events':
                return (
                    <div className="form-content">
                        <h3>Events QR Code</h3>
                        <form>
                            <div className="form-group">
                                <label>Enter the title of the event</label>
                                <input type="text" name="title" onChange={handleChange} value={formData.title || ''} />
                            </div>
                            <div className="form-group">
                                <label>Enter the location of the event</label>
                                <input type="text" name="location" onChange={handleChange} value={formData.location || ''} />
                            </div>
                            <div className="form-group">
                                <label>Start date and time</label>
                                <input type="datetime-local" name="start" onChange={handleChange} value={formData.start || ''} />
                            </div>
                            <div className="form-group">
                                <label>End date and time</label>
                                <input type="datetime-local" name="end" onChange={handleChange} value={formData.end || ''} />
                                {formErrors.end && <span className="error-message">{formErrors.end}</span>}
                            </div>
                            <div className="form-group">
                                <label>Enter the description of the event</label>
                                <textarea name="description" onChange={handleChange} value={formData.description || ''}></textarea>
                            </div>
                        </form>
                    </div>
                );
            case 'Text Messages':
                return (
                    <div className="form-content">
                        <h3>Text Messages QR Code</h3>
                        <form>
                            <div className="form-group">
                                <label>Enter phone number</label>
                                <input type="tel" name="phone" onChange={handleChange} value={formData.phone || ''} />
                                {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                            </div>
                            <div className="form-group">
                                <label>Enter message</label>
                                <textarea name="message" onChange={handleChange} value={formData.message || ''} required></textarea>
                            </div>
                        </form>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="generate-container">
            <div className="left-container">
                <div className="button-box">
                    <h2>Select a type to generate QR Code</h2>
                    <div className="button-container">
                        <button onClick={() => handleButtonClick('Text')}>
                            <FontAwesomeIcon icon={faTextWidth} /> Text
                        </button>
                        <button onClick={() => handleButtonClick('Contact/vCard')}>
                            <FontAwesomeIcon icon={faIdCard} /> Contact/vCard
                        </button>
                        <button onClick={() => handleButtonClick('URL')}>
                            <FontAwesomeIcon icon={faLink} /> URL
                        </button>
                        <button onClick={() => handleButtonClick('Wireless')}>
                            <FontAwesomeIcon icon={faWifi} /> Wireless
                        </button>
                        <button onClick={() => handleButtonClick('E-mail')}>
                            <FontAwesomeIcon icon={faEnvelope} /> E-mail
                        </button>
                        <button onClick={() => handleButtonClick('Phone')}>
                            <FontAwesomeIcon icon={faPhone} /> Phone
                        </button>
                        <button onClick={() => handleButtonClick('Events')}>
                            <FontAwesomeIcon icon={faCalendarAlt} /> Events
                        </button>
                        <button onClick={() => handleButtonClick('Text Messages')}>
                            <FontAwesomeIcon icon={faSms} /> Text Messages
                        </button>
                    </div>
                </div>
                <div className="form-box">
                    {renderForm()}
                </div>
            </div>
            <div className="right-container">
                <h2>QR Code will be displayed here</h2>
                {qrValue !== 'QR Code will be displayed here' && qrValue && (
                    <>
                        <div className="qr-code">
                            <QRCode
                                id="qr-gen"
                                value={qrValue}
                                size={256}
                                fgColor={qrColor}
                                bgColor={bgColor}
                                level="H"
                                renderAs="canvas"
                            />
                        </div>
                        <div className="action-buttons">
                            <button
                                type="button"
                                className={`download-button ${isFormValid ? 'valid' : 'invalid'}`}
                                onClick={() => { downloadQrCode(); clearFormData();}}
                                disabled={!isFormValid}
                            >
                                Download QR Code
                            </button>
                            <FontAwesomeIcon
                                icon={faCog}
                                className="customize-icon"
                                title="Customize color"
                                onClick={handleCustomizeOpen}
                            />
                        </div>
                    </>
                )}
                {showCustomizeDialog && (
                    <div className="customize-dialog">
                        <div className="customize-options">
                            <h3>Customize QR Color</h3>
                            <div className="form-group">
                                <label>QR Code Color</label>
                                <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Background Color</label>
                                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                            </div>
                            <div className="customize-dialog-buttons">
                                <button onClick={handleCustomizeCancel}>Cancel</button>
                                <button onClick={handleCustomizeDone}>Done</button>
                            </div>
                        </div>
                    </div>
                )}
                {showWarningDialog && (
                    <div className="warning-dialog">
                        <p>Some color combinations may make the QR code unscannable. Do you want to proceed?</p>
                        <div className="warning-dialog-buttons">
                            <button onClick={handleWarningCancel}>Cancel</button>
                            <button onClick={handleWarningConfirm}>Confirm</button>
                        </div>
                    </div>
                )}
                {showDiscardDialog && (
                    <div className="discard-dialog">
                        <p>Discard changes?</p>
                        <p>You will lose the changes made to the current page when you change the QR Code type.</p>
                        <button onClick={handleCancel}>Cancel</button>
                        <button onClick={handleDiscard}>Discard</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const PhoneNumberFields = ({ formData, handleChange, formErrors }) => {
    const [phoneNumbers, setPhoneNumbers] = useState(['']);

    const handleAddPhoneNumber = () => {
        setPhoneNumbers([...phoneNumbers, '']);
    };

    const handleRemovePhoneNumber = (index) => {
        const newPhoneNumbers = phoneNumbers.filter((_, i) => i !== index);
        setPhoneNumbers(newPhoneNumbers);
        handleChange({ target: { name: `phone${index}`, value: '' } }); // Remove the value from formData
        updateMainPhoneField(newPhoneNumbers);
    };

    const handlePhoneNumberChange = (index, value) => {
        const newPhoneNumbers = phoneNumbers.map((phoneNumber, i) => i === index ? value : phoneNumber);
        setPhoneNumbers(newPhoneNumbers);
        handleChange({ target: { name: `phone${index}`, value } });
        updateMainPhoneField(newPhoneNumbers);
    };

    const updateMainPhoneField = (phoneNumbers) => {
        handleChange({ target: { name: 'phone', value: phoneNumbers.join(';') } });
    };

    return (
        <div className="form-group phone-number-group">
            {phoneNumbers.map((phoneNumber, index) => (
                <div key={index} className="phone-number-field">
                    <label>Enter your telephone number</label>
                    <div className="phone-number-input">
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                            className="short-input"
                        />
                        {formErrors[`phone${index}`] && <span className="error-message">{formErrors[`phone${index}`]}</span>}
                        {phoneNumbers.length > 1 && (
                            <button type="button" className="remove-button" onClick={() => handleRemovePhoneNumber(index)}>-</button>
                        )}
                    </div>
                </div>
            ))}
            {/* <button type="button" className="add-button" onClick={handleAddPhoneNumber}>+</button> */}
        </div>
    );
};

const WirelessForm = ({ formData, handleChange }) => {
    const [securityType, setSecurityType] = useState('');

    const handleSecurityChange = (e) => {
        const { value } = e.target;
        setSecurityType(value);
        handleChange(e);
    };

    return (
        <div className="form-content">
            <h3>Wireless QR Code</h3>
            <form>
                <div className="form-group">
                    <label>Security type</label>
                    <select name="security" value={securityType} onChange={handleSecurityChange}>
                        <option value="">Security type</option>
                        <option value="No password">No password</option>
                        <option value="WPA/WPA2">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Enter SSID/network name</label>
                    <input type="text" name="ssid" onChange={handleChange} value={formData.ssid || ''} />
                </div>
                {securityType !== 'No password' && (
                    <div className="form-group">
                        <label>Enter password</label>
                        <input type="password" name="password" onChange={handleChange} value={formData.password || ''} />
                    </div>
                )}
            </form>
        </div>
    );
};

export default Generate;

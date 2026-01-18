/**
 * QR Data Encoders
 * Utility functions to encode various data types into QR-compatible formats
 */

/**
 * Encode WiFi credentials for QR code
 * @param {Object} data - WiFi data
 * @param {string} data.ssid - Network name
 * @param {string} data.password - Network password
 * @param {string} data.encryption - WPA, WPA2, WEP, or nopass
 * @param {boolean} data.hidden - Is network hidden
 */
export function encodeWiFi({ ssid, password, encryption = 'WPA', hidden = false }) {
  const escapeSpecialChars = (str) => {
    return str.replace(/[\\;,:\"]/g, '\\$&');
  };
  
  const escapedSSID = escapeSpecialChars(ssid);
  const escapedPassword = escapeSpecialChars(password);
  const hiddenStr = hidden ? 'true' : 'false';
  
  if (encryption === 'nopass') {
    return `WIFI:T:nopass;S:${escapedSSID};H:${hiddenStr};;`;
  }
  
  return `WIFI:T:${encryption};S:${escapedSSID};P:${escapedPassword};H:${hiddenStr};;`;
}

/**
 * Encode vCard for QR code
 * @param {Object} data - Contact data
 */
export function encodeVCard({ 
  firstName, 
  lastName, 
  phone, 
  email, 
  company, 
  jobTitle, 
  website, 
  address 
}) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
  ];
  
  if (firstName || lastName) {
    lines.push(`N:${lastName || ''};${firstName || ''};;;`);
    lines.push(`FN:${[firstName, lastName].filter(Boolean).join(' ')}`);
  }
  
  if (phone) lines.push(`TEL:${phone}`);
  if (email) lines.push(`EMAIL:${email}`);
  if (company) lines.push(`ORG:${company}`);
  if (jobTitle) lines.push(`TITLE:${jobTitle}`);
  if (website) lines.push(`URL:${website}`);
  if (address) lines.push(`ADR:;;${address};;;;`);
  
  lines.push('END:VCARD');
  
  return lines.join('\n');
}

/**
 * Encode email mailto link
 * @param {Object} data - Email data
 */
export function encodeEmail({ email, subject, body }) {
  let mailto = `mailto:${encodeURIComponent(email)}`;
  const params = [];
  
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  
  if (params.length > 0) {
    mailto += '?' + params.join('&');
  }
  
  return mailto;
}

/**
 * Encode phone tel link
 * @param {string} phone - Phone number
 */
export function encodePhone(phone) {
  // Remove all non-numeric except + at start
  const cleanPhone = phone.replace(/(?!^\+)[^\d]/g, '');
  return `tel:${cleanPhone}`;
}

/**
 * Encode SMS link
 * @param {Object} data - SMS data
 */
export function encodeSMS({ phone, message }) {
  const cleanPhone = phone.replace(/(?!^\+)[^\d]/g, '');
  let sms = `sms:${cleanPhone}`;
  
  if (message) {
    sms += `?body=${encodeURIComponent(message)}`;
  }
  
  return sms;
}

/**
 * Encode calendar event (iCalendar format)
 * @param {Object} data - Event data
 */
export function encodeEvent({ title, startDate, endDate, location, description }) {
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
  ];
  
  if (title) lines.push(`SUMMARY:${title}`);
  if (startDate) lines.push(`DTSTART:${formatDate(startDate)}`);
  if (endDate) lines.push(`DTEND:${formatDate(endDate)}`);
  if (location) lines.push(`LOCATION:${location}`);
  if (description) lines.push(`DESCRIPTION:${description}`);
  
  lines.push('END:VEVENT', 'END:VCALENDAR');
  
  return lines.join('\n');
}

/**
 * Get the QR type label
 */
export const QR_TYPES = {
  url: { label: 'URL / Text', icon: '🔗' },
  wifi: { label: 'WiFi', icon: '📶' },
  vcard: { label: 'Contact', icon: '👤' },
  email: { label: 'Email', icon: '✉️' },
  phone: { label: 'Phone', icon: '📞' },
  sms: { label: 'SMS', icon: '💬' },
  event: { label: 'Event', icon: '📅' },
  batch: { label: 'Batch', icon: '📦' },
};

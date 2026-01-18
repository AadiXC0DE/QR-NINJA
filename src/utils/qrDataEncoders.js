/**
 * QR Data Encoders
 * Utility functions to encode various data types into QR-compatible formats
 */

import React from 'react';

/**
 * Encode WiFi credentials for QR code
 */
export function encodeWiFi({
  ssid,
  password,
  encryption = 'WPA',
  hidden = false,
}) {
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
 */
export function encodeVCard({
  firstName,
  lastName,
  phone,
  email,
  company,
  jobTitle,
  website,
  address,
}) {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];

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
 */
export function encodePhone(phone) {
  const cleanPhone = phone.replace(/(?!^\+)[^\d]/g, '');
  return `tel:${cleanPhone}`;
}

/**
 * Encode SMS link
 */
export function encodeSMS({ phone, message }) {
  const cleanPhone = phone.replace(/(?!^\+)[^\d]/g, '');
  let sms = `sms:${cleanPhone}`;
  if (message) sms += `?body=${encodeURIComponent(message)}`;
  return sms;
}

/**
 * Encode calendar event (iCalendar format)
 */
export function encodeEvent({
  title,
  startDate,
  endDate,
  location,
  description,
}) {
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT'];

  if (title) lines.push(`SUMMARY:${title}`);
  if (startDate) lines.push(`DTSTART:${formatDate(startDate)}`);
  if (endDate) lines.push(`DTEND:${formatDate(endDate)}`);
  if (location) lines.push(`LOCATION:${location}`);
  if (description) lines.push(`DESCRIPTION:${description}`);

  lines.push('END:VEVENT', 'END:VCALENDAR');

  return lines.join('\n');
}

/**
 * Consolidated QR Type Configuration with SVG Icons
 */
export const QR_TYPE_CONFIG = {
  url: {
    label: 'URL / Text',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
  },
  wifi: {
    label: 'WiFi',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
        />
      </svg>
    ),
  },
  vcard: {
    label: 'Contact',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  email: {
    label: 'Email',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  phone: {
    label: 'Phone',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
  },
  sms: {
    label: 'SMS',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  event: {
    label: 'Event',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  batch: {
    label: 'Batch',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
};

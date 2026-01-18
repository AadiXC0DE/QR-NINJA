"use client";

import { useState } from "react";

/**
 * Dynamic QR Form Fields Component
 * Renders different input fields based on QR type
 */
const QRFormFields = ({ type, formData, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const inputClass = "w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none transition-colors";
  const labelClass = "block text-gray-300 text-sm mb-1";

  // URL/Text type
  if (type === "url") {
    return (
      <div className="w-full max-w-xl">
        <input
          type="text"
          placeholder="Enter URL or text..."
          className={inputClass}
          value={formData.url || ""}
          onChange={(e) => handleChange("url", e.target.value)}
        />
      </div>
    );
  }

  // WiFi type
  if (type === "wifi") {
    return (
      <div className="w-full max-w-xl space-y-4">
        <div>
          <label className={labelClass}>Network Name (SSID)*</label>
          <input
            type="text"
            placeholder="WiFi Network Name"
            className={inputClass}
            value={formData.ssid || ""}
            onChange={(e) => handleChange("ssid", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Password</label>
          <input
            type="password"
            placeholder="WiFi Password"
            className={inputClass}
            value={formData.password || ""}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className={labelClass}>Encryption</label>
            <select
              className={inputClass}
              value={formData.encryption || "WPA"}
              onChange={(e) => handleChange("encryption", e.target.value)}
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None</option>
            </select>
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hidden || false}
                onChange={(e) => handleChange("hidden", e.target.checked)}
                className="w-4 h-4"
              />
              Hidden Network
            </label>
          </div>
        </div>
      </div>
    );
  }

  // vCard type
  if (type === "vcard") {
    return (
      <div className="w-full max-w-xl space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name*</label>
            <input
              type="text"
              placeholder="John"
              className={inputClass}
              value={formData.firstName || ""}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input
              type="text"
              placeholder="Doe"
              className={inputClass}
              value={formData.lastName || ""}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Phone</label>
            <input
              type="tel"
              placeholder="+1 234 567 8900"
              className={inputClass}
              value={formData.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              className={inputClass}
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Company</label>
            <input
              type="text"
              placeholder="Company Name"
              className={inputClass}
              value={formData.company || ""}
              onChange={(e) => handleChange("company", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Job Title</label>
            <input
              type="text"
              placeholder="Software Engineer"
              className={inputClass}
              value={formData.jobTitle || ""}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Website</label>
          <input
            type="url"
            placeholder="https://example.com"
            className={inputClass}
            value={formData.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Address</label>
          <input
            type="text"
            placeholder="123 Main St, City, Country"
            className={inputClass}
            value={formData.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>
      </div>
    );
  }

  // Email type
  if (type === "email") {
    return (
      <div className="w-full max-w-xl space-y-4">
        <div>
          <label className={labelClass}>Email Address*</label>
          <input
            type="email"
            placeholder="email@example.com"
            className={inputClass}
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Subject (optional)</label>
          <input
            type="text"
            placeholder="Email subject..."
            className={inputClass}
            value={formData.subject || ""}
            onChange={(e) => handleChange("subject", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Body (optional)</label>
          <textarea
            placeholder="Email body..."
            className={`${inputClass} resize-none h-24`}
            value={formData.body || ""}
            onChange={(e) => handleChange("body", e.target.value)}
          />
        </div>
      </div>
    );
  }

  // Phone type
  if (type === "phone") {
    return (
      <div className="w-full max-w-xl">
        <label className={labelClass}>Phone Number*</label>
        <input
          type="tel"
          placeholder="+1 234 567 8900"
          className={inputClass}
          value={formData.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
        <p className="text-gray-500 text-sm mt-2">Include country code for international numbers</p>
      </div>
    );
  }

  // SMS type
  if (type === "sms") {
    return (
      <div className="w-full max-w-xl space-y-4">
        <div>
          <label className={labelClass}>Phone Number*</label>
          <input
            type="tel"
            placeholder="+1 234 567 8900"
            className={inputClass}
            value={formData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Pre-filled Message (optional)</label>
          <textarea
            placeholder="Your message here..."
            className={`${inputClass} resize-none h-24`}
            value={formData.message || ""}
            onChange={(e) => handleChange("message", e.target.value)}
          />
        </div>
      </div>
    );
  }

  // Event type
  if (type === "event") {
    return (
      <div className="w-full max-w-xl space-y-4">
        <div>
          <label className={labelClass}>Event Title*</label>
          <input
            type="text"
            placeholder="Meeting with client"
            className={inputClass}
            value={formData.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Start Date & Time*</label>
            <input
              type="datetime-local"
              className={inputClass}
              value={formData.startDate || ""}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>End Date & Time*</label>
            <input
              type="datetime-local"
              className={inputClass}
              value={formData.endDate || ""}
              onChange={(e) => handleChange("endDate", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Location (optional)</label>
          <input
            type="text"
            placeholder="123 Main St, City"
            className={inputClass}
            value={formData.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Description (optional)</label>
          <textarea
            placeholder="Event description..."
            className={`${inputClass} resize-none h-20`}
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>
      </div>
    );
  }

  // Batch type
  if (type === "batch") {
    return (
      <div className="w-full max-w-xl space-y-4">
        <div>
          <label className={labelClass}>Enter URLs/Text (one per line, max 50)</label>
          <textarea
            placeholder="https://example.com&#10;https://another-site.com&#10;Some text here..."
            className={`${inputClass} resize-none h-48 font-mono text-sm`}
            value={formData.batchData || ""}
            onChange={(e) => handleChange("batchData", e.target.value)}
          />
        </div>
        <p className="text-gray-500 text-sm">
          Each line will generate a separate QR code. 
          <span className="text-gray-400"> ({(formData.batchData?.split("\n").filter(Boolean).length || 0)}/50 items)</span>
        </p>
      </div>
    );
  }

  return null;
};

export default QRFormFields;

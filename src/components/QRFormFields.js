"use client";

/**
 * Premium QR Form Fields Component
 * Refined input styling with clean aesthetics
 */
const QRFormFields = ({ type, formData, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const inputClass = `
    w-full px-4 py-3.5 rounded-xl 
    bg-zinc-900/80 backdrop-blur-sm
    text-white placeholder-zinc-500
    border border-zinc-800 
    focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 focus:outline-none 
    transition-all duration-200
  `;
  
  const labelClass = "block text-zinc-400 text-xs uppercase tracking-wider mb-2 font-medium";

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
      <div className="w-full max-w-xl space-y-5">
        <div>
          <label className={labelClass}>Network Name (SSID)</label>
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
            <label className="flex items-center gap-3 text-zinc-400 cursor-pointer hover:text-white transition-colors">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.hidden || false}
                  onChange={(e) => handleChange("hidden", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 border-2 border-zinc-600 rounded peer-checked:bg-white peer-checked:border-white transition-all" />
                <svg 
                  className="absolute inset-0 w-5 h-5 text-black opacity-0 peer-checked:opacity-100 transition-opacity" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm">Hidden Network</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  // vCard type
  if (type === "vcard") {
    return (
      <div className="w-full max-w-xl space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name</label>
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
      <div className="w-full max-w-xl space-y-5">
        <div>
          <label className={labelClass}>Email Address</label>
          <input
            type="email"
            placeholder="email@example.com"
            className={inputClass}
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Subject <span className="text-zinc-600">(optional)</span></label>
          <input
            type="text"
            placeholder="Email subject..."
            className={inputClass}
            value={formData.subject || ""}
            onChange={(e) => handleChange("subject", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Body <span className="text-zinc-600">(optional)</span></label>
          <textarea
            placeholder="Email body..."
            className={`${inputClass} resize-none h-28`}
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
        <label className={labelClass}>Phone Number</label>
        <input
          type="tel"
          placeholder="+1 234 567 8900"
          className={inputClass}
          value={formData.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
        <p className="text-zinc-600 text-sm mt-3">Include country code for international numbers</p>
      </div>
    );
  }

  // SMS type
  if (type === "sms") {
    return (
      <div className="w-full max-w-xl space-y-5">
        <div>
          <label className={labelClass}>Phone Number</label>
          <input
            type="tel"
            placeholder="+1 234 567 8900"
            className={inputClass}
            value={formData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Message <span className="text-zinc-600">(optional)</span></label>
          <textarea
            placeholder="Your message here..."
            className={`${inputClass} resize-none h-28`}
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
      <div className="w-full max-w-xl space-y-5">
        <div>
          <label className={labelClass}>Event Title</label>
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
            <label className={labelClass}>Start</label>
            <input
              type="datetime-local"
              className={inputClass}
              value={formData.startDate || ""}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>End</label>
            <input
              type="datetime-local"
              className={inputClass}
              value={formData.endDate || ""}
              onChange={(e) => handleChange("endDate", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Location <span className="text-zinc-600">(optional)</span></label>
          <input
            type="text"
            placeholder="123 Main St, City"
            className={inputClass}
            value={formData.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Description <span className="text-zinc-600">(optional)</span></label>
          <textarea
            placeholder="Event description..."
            className={`${inputClass} resize-none h-24`}
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>
      </div>
    );
  }

  // Batch type
  if (type === "batch") {
    const itemCount = formData.batchData?.split("\n").filter(Boolean).length || 0;
    
    return (
      <div className="w-full max-w-xl space-y-4">
        <div>
          <label className={labelClass}>
            Enter URLs or Text 
            <span className="text-zinc-600 ml-2">(one per line, max 50)</span>
          </label>
          <textarea
            placeholder={"https://example.com\nhttps://another-site.com\nSome text here..."}
            className={`${inputClass} resize-none h-52 font-mono text-sm`}
            value={formData.batchData || ""}
            onChange={(e) => handleChange("batchData", e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">
            {itemCount} of 50 items
          </span>
          <div className="flex items-center gap-2">
            <div 
              className="h-1.5 w-24 bg-zinc-800 rounded-full overflow-hidden"
            >
              <div 
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${Math.min((itemCount / 50) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default QRFormFields;

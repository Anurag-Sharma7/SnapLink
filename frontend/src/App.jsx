import { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentLinks, setRecentLinks] = useState([]);

  // Load recent links from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("recentLinks");
    if (saved) {
      try {
        setRecentLinks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent links");
      }
    }
  }, []);

  // Save to localStorage whenever recentLinks changes
  useEffect(() => {
    localStorage.setItem("recentLinks", JSON.stringify(recentLinks));
  }, [recentLinks]);

  const handleSubmit = async () => {
    if (!url || loading) return;
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: url,
      });

      const newShortUrl = res.data.shortUrl;
      const shortId = res.data.shortId;
      setShortUrl(newShortUrl);
      setCopied(false);

      // Add to recent links
      setRecentLinks((prev) => {
        if (prev.find((link) => link.shortId === shortId)) return prev;
        return [
          {
            shortId,
            shortUrl: newShortUrl,
            originalUrl: url,
            clicks: 0,
          },
          ...prev,
        ];
      });
      
      setUrl("");
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const refreshClicks = async (shortId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/analytics/${shortId}`);
      const data = res.data;

      setRecentLinks((prev) =>
        prev.map((link) => {
          if (link.shortId === shortId) {
            return { ...link, clicks: data.clicks };
          }
          return link;
        })
      );
    } catch (err) {
      console.error("Failed to refresh clicks", err);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "qr-code.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-sans">
      <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-500 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 drop-shadow-sm">
            SnapLink
          </h1>
          <p className="text-slate-300 text-lg">
            Shorten your URLs instantly.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full relative">
          <input
            type="text"
            className="input w-full bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 rounded-2xl h-14 px-6 text-lg transition-all"
            placeholder="Paste your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="btn border-none bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-900 font-bold text-lg w-full rounded-2xl h-14 shadow-lg hover:shadow-teal-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Shorten URL"
            )}
          </button>
        </div>

        {shortUrl && (
          <div className="mt-10 flex flex-col items-center bg-black/20 p-8 rounded-3xl border border-white/5 animate-fade-in-up">
            <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold mb-3">Your Shortened Link</p>

            <a
              className="text-2xl font-bold text-teal-400 hover:text-teal-300 transition-colors break-all text-center mb-6"
              target="_blank"
              rel="noreferrer"
              href={shortUrl}
            >
              {shortUrl}
            </a>

            <div className="flex gap-4 w-full">
              <button
                onClick={() => handleCopy(shortUrl)}
                className={`flex-1 btn border-none text-white font-semibold rounded-xl h-12 transition-all ${
                  copied ? "bg-emerald-500 hover:bg-emerald-400" : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>

            <div className="mt-8 bg-white p-4 rounded-2xl shadow-xl transform transition-transform hover:scale-105 duration-300">
              <QRCodeSVG id="qr-code-svg" value={shortUrl} size={180} level="H" />
            </div>

            <button
              onClick={handleDownloadQR}
              className="mt-6 btn btn-ghost text-teal-400 hover:text-teal-300 hover:bg-white/5 rounded-xl font-semibold"
            >
              Download QR Code
            </button>
          </div>
        )}
      </div>

      {recentLinks.length > 0 && (
        <div className="max-w-3xl w-full mt-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 animate-fade-in-up">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Recent Links & Analytics
          </h2>
          
          <div className="flex flex-col gap-4">
            {recentLinks.map((link) => (
              <div key={link.shortId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-black/20 hover:bg-black/40 border border-white/5 rounded-2xl transition-all">
                <div className="flex-1 min-w-0 mb-4 sm:mb-0 pr-4">
                  <a href={link.shortUrl} target="_blank" rel="noreferrer" className="text-teal-400 font-semibold text-lg hover:underline block truncate">
                    {link.shortUrl}
                  </a>
                  <p className="text-slate-400 text-sm truncate mt-1">{link.originalUrl}</p>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Clicks</span>
                    <span className="text-2xl font-bold text-white">{link.clicks}</span>
                  </div>
                  
                  <button 
                    onClick={() => refreshClicks(link.shortId)}
                    className="btn btn-circle btn-ghost text-slate-300 hover:text-teal-400 hover:bg-white/10"
                    title="Refresh Clicks"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
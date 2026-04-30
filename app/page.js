"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// SVG Icons
const CloudIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cloud-icon">
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    <path d="M12 12v9" />
    <path d="m8 17 4 4 4-4" />
  </svg>
);

const HomeIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const DownloadIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

const SearchIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
);

const HistoryIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const SettingsIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const AudioIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
  </svg>
);

const ImageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const MonitorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const DatabaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const TerminalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ShareIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const PlusSquareIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const changelogData = [
  {
    version: "1.3",
    date: "2026-04-30",
    isNew: true,
    items: [
      { title: "TikTok CDN Bypass", description: "Fix error 403 Forbidden pas download audio/video TikTok. Link CDN disikat langsung sampe dapet!" },
      { title: "Audio History Player", description: "Player MP3 minimalis di riwayat download. Gak ada lagi layar video item yang ngga jelas." },
      { title: "Smart Re-download", description: "Tombol download ulang sekarang pinter. Kalo lu download audio, dia narik audio lagi. Gak bakal nyasar jadi video lagi!" },
      { title: "Iframe Scraper", description: "Mesin baru buat nembus web-web embed (kayak web anime/film). Kalau link utama gagal, sistem bakal bongkar HTML buat nyari video yang ngumpet!" },
      { title: "Keamanan Publik", description: "Pesan error sekarang \"Sopan & Rahasia\". Alamat folder server udah disensor mutlak biar aman buat publik." },
      { title: "Premium Settings", description: "Desain menu baru gaya SholatKu (Grouped List) biar navigasi makin berkelas." },
      { title: "Smart PWA Popup", description: "Deteksi otomatis perangkat Apple (iOS) dengan panduan 'Add to Home Screen' yang rapi dan interaktif." },
      { title: "Resolution Selector", description: "Fitur pilih kualitas video (HD, SD, dsb) balik lagi biar lu bisa atur kuota!" },
      { title: "Pure Audio Engine", description: "Fix download audio YouTube yang kadang masih bawa video. Sekarang beneran MP3 doang!" }
    ]
  },
  {
    version: "1.2",
    date: "2026-04-16",
    isNew: false,
    items: [
      { title: "Riwayat Dipisah", description: "Sekarang ada tab khusus riwayat link (Kaca Pembesar) sama riwayat file (Tombol Download). Biar gak campur aduk kyk gado-gado!" },
      { title: "Input Gak Pelit", description: "Form input download-nya sekarang standby terus di atas. Gak perlu nunggu hasil ilang buat download video lain. Sat set wat wet!" },
      { title: "PWA Makin Gacor", description: "Popup install-nya sekarang lebih pinter. Kalo Chrome malu-malu munculin install, udah ada tombol manual di Setting." },
      { title: "UI Makin Ganteng", description: "Updated icons dan cara beresin log link/download biar lebih praktis." }
    ]
  },
  {
    version: "1.1",
    date: "2026-04-14",
    isNew: false,
    items: [
      { title: "Mesin Gahar", description: "Pake local yt-dlp biar download video makin lancar jaya sentosa." },
      { title: "Desain Mewah", description: "Tampilan glassmorphism ala-ala HP mahal biar betah pakenya." },
      { title: "Akses Publik", description: "Udah terintegrasi Cloudflare Tunnel biar bisa diakses lewat domain jekdownloader.ajekkk.my.id." }
    ]
  }
];

const ChangelogModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay fade-in" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div className="glass-card fade-in-up" onClick={e => e.stopPropagation()} style={{
        maxWidth: 500, width: '100%', maxHeight: '80vh', overflowY: 'auto', position: 'relative',
        padding: 30, borderRadius: 24, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 15, right: 15, background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', zIndex: 10
        }}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ width: 60, height: 60, background: 'rgba(58, 130, 246, 0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#3A82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M9 17l3 3 3-3M8 4l8 16" /></svg>
          </div>
          <h2 style={{ marginBottom: 5 }}>JekDownloader</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>Version {changelogData[0].version}</p>
        </div>

        <div style={{ borderLeft: '2px solid rgba(255,255,255,0.1)', marginLeft: 10, paddingLeft: 20 }}>
          {changelogData.map((release) => (
            <div key={release.version} style={{ marginBottom: 40, position: 'relative' }}>
              <div style={{
                position: 'absolute', left: -26, top: 5, width: 10, height: 10, borderRadius: '50%',
                background: release.isNew ? '#3A82F6' : '#444',
                boxShadow: release.isNew ? '0 0 10px #3A82F6' : 'none'
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>v{release.version}</span>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{release.date}</span>
                {release.isNew && <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontSize: '0.6rem', padding: '2px 8px', borderRadius: 4, fontWeight: 'bold' }}>LATEST</span>}
              </div>

              {release.items.map((item, i) => (
                <div key={i} style={{ marginBottom: 15 }}>
                  <h5 style={{ fontSize: '0.85rem', marginBottom: 2, color: '#fff' }}>{item.title}</h5>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>{item.description}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// Platform Detection Helper
const getPlatform = (url) => {
  if (!url) return { name: 'Lainnya', emoji: '🌐', color: '#6b7280' };
  const u = url.toLowerCase();
  if (u.includes('tiktok.com') || u.includes('vt.tiktok')) return { name: 'TikTok', emoji: '🎵', color: '#ff0050' };
  if (u.includes('youtube.com') || u.includes('youtu.be')) return { name: 'YouTube', emoji: '▶️', color: '#ff0000' };
  if (u.includes('twitter.com') || u.includes('x.com')) return { name: 'X', emoji: '𝕏', color: '#1d9bf0' };
  if (u.includes('instagram.com')) return { name: 'Instagram', emoji: '📸', color: '#e1306c' };
  if (u.includes('facebook.com') || u.includes('fb.watch')) return { name: 'Facebook', emoji: '📘', color: '#1877f2' };
  if (u.includes('spotify.com')) return { name: 'Spotify', emoji: '🎧', color: '#1db954' };
  if (u.includes('soundcloud.com')) return { name: 'SoundCloud', emoji: '🔊', color: '#ff5500' };
  if (u.includes('reddit.com')) return { name: 'Reddit', emoji: '🤖', color: '#ff4500' };
  return { name: 'Lainnya', emoji: '🌐', color: '#6b7280' };
};

// Proxy thumbnail untuk bypass CDN restriction (TikTok, dll)
const getProxiedThumbnail = (url) => {
  if (!url) return "";
  if (url.startsWith("/") || url.startsWith("data:") || url.includes("placehold")) return url;
  return `/api/thumbnail?url=${encodeURIComponent(url)}`;
};

// Filter Bar Component
const FilterBar = ({ dateFilter, setDateFilter, customFrom, setCustomFrom, customTo, setCustomTo, platformFilter, setPlatformFilter, platforms, onClearAll, onDeleteSelected, itemCount, selectMode, setSelectMode, selectedCount }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
      <select
        value={dateFilter}
        onChange={e => setDateFilter(e.target.value)}
        style={{
          flex: 1, minWidth: 120, padding: '8px 12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.8rem', outline: 'none'
        }}
      >
        <option value="all">📅 Semua Waktu</option>
        <option value="today">Hari Ini</option>
        <option value="week">7 Hari Terakhir</option>
        <option value="month">30 Hari Terakhir</option>
        <option value="custom">📆 Kustom...</option>
      </select>
      {platforms && platforms.length > 1 && (
        <select
          value={platformFilter}
          onChange={e => setPlatformFilter(e.target.value)}
          style={{
            flex: 1, minWidth: 120, padding: '8px 12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.8rem', outline: 'none'
          }}
        >
          <option value="all">🌐 Semua Platform</option>
          {platforms.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      )}
    </div>
    {dateFilter === 'custom' && (
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
          style={{ flex: 1, padding: '8px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.75rem', outline: 'none' }}
        />
        <span style={{ color: 'rgba(255,255,255,0.4)', alignSelf: 'center', fontSize: '0.75rem' }}>s/d</span>
        <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
          style={{ flex: 1, padding: '8px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.75rem', outline: 'none' }}
        />
      </div>
    )}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{itemCount} item</span>
      <div style={{ display: 'flex', gap: 6 }}>
        {selectMode ? (
          <>
            <button onClick={onDeleteSelected} disabled={selectedCount === 0}
              style={{ padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(255,69,58,0.4)', background: selectedCount > 0 ? 'rgba(255,69,58,0.2)' : 'rgba(255,69,58,0.05)', color: selectedCount > 0 ? '#ff453a' : '#666', fontSize: '0.7rem', cursor: selectedCount > 0 ? 'pointer' : 'default' }}
            >
              🗑️ Hapus ({selectedCount})
            </button>
            <button onClick={() => setSelectMode(false)}
              style={{ padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: '#aaa', fontSize: '0.7rem', cursor: 'pointer' }}
            >
              Batal
            </button>
          </>
        ) : (
          <>
            {itemCount > 0 && (
              <button onClick={() => setSelectMode(true)}
                style={{ padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: '#aaa', fontSize: '0.7rem', cursor: 'pointer' }}
              >
                ☑️ Pilih
              </button>
            )}
            {itemCount > 0 && (
              <button onClick={onClearAll}
                style={{ padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(255,69,58,0.3)', background: 'rgba(255,69,58,0.1)', color: '#ff453a', fontSize: '0.7rem', cursor: 'pointer' }}
              >
                🗑️ Semua
              </button>
            )}
          </>
        )}
      </div>
    </div>
  </div>
);

function DownloaderApp() {
  const searchParams = useSearchParams();
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle");
  const [activeQueue, setActiveQueue] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [percent, setPercent] = useState(0);
  const [selectedResolutions, setSelectedResolutions] = useState({});
  const [downloadingIds, setDownloadingIds] = useState({});

  // Tab State: 'home', 'history', 'downloads', 'settings'
  const [activeTab, setActiveTab] = useState("home");
  const [extractionHistory, setExtractionHistory] = useState([]);
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  // Filter states
  const [linkDateFilter, setLinkDateFilter] = useState('all');
  const [linkPlatformFilter, setLinkPlatformFilter] = useState('all');
  const [linkCustomFrom, setLinkCustomFrom] = useState('');
  const [linkCustomTo, setLinkCustomTo] = useState('');
  const [dlDateFilter, setDlDateFilter] = useState('all');
  const [dlPlatformFilter, setDlPlatformFilter] = useState('all');
  const [dlCustomFrom, setDlCustomFrom] = useState('');
  const [dlCustomTo, setDlCustomTo] = useState('');
  const [expandedDownloadId, setExpandedDownloadId] = useState(null);
  // Selection states
  const [linkSelectMode, setLinkSelectMode] = useState(false);
  const [linkSelected, setLinkSelected] = useState(new Set());
  const [dlSelectMode, setDlSelectMode] = useState(false);
  const [dlSelected, setDlSelected] = useState(new Set());
  const [sharingId, setSharingId] = useState(null);

  useEffect(() => {
    // Detect iOS (iPhone/iPad/iPod)
    const checkIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(checkIOS);

    // Load Extraction History
    const savedExtract = localStorage.getItem("jekdownloader_extraction_history");
    if (savedExtract) {
      try { setExtractionHistory(JSON.parse(savedExtract)); } catch (e) { }
    }

    // Load Download History
    const savedDownload = localStorage.getItem("jekdownloader_download_history");
    if (savedDownload) {
      try { setDownloadHistory(JSON.parse(savedDownload)); } catch (e) { }
    }

    // Check if already installed as PWA (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const dismissed = sessionStorage.getItem("jekdownloader_install_dismissed");

    // Smart Popup Logic
    if (!isStandalone && !dismissed) {
      if (checkIOS) {
        // iOS: Show guide after delay because there's no install event
        setTimeout(() => setShowInstallPrompt(true), 6000);
      }
      // For Android/Desktop, the popup will be triggered by handleBeforeInstallPrompt
    }

    // PWA Install Prompt Logic (Chrome/Edge)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    // Share Target Logic
    const sharedText = searchParams.get("text");
    const sharedUrl = searchParams.get("url");

    let finalUrl = "";
    if (sharedUrl && sharedUrl.startsWith("http")) finalUrl = sharedUrl;
    else if (sharedText && sharedText.includes("http")) {
      const match = sharedText.match(/(https?:\/\/[^\s]+)/g);
      if (match) finalUrl = match[0];
    }

    if (finalUrl && status === "idle") {
      setActiveTab("home");
      setUrl(finalUrl);
      processDownload(finalUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === 'processing') {
      const interval = setInterval(() => {
        setPercent(prev => prev < 90 ? prev + Math.floor(Math.random() * 15) : prev);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [status]);

  const processDownload = async (inputUrl) => {
    if (!inputUrl) return;
    setStatus("processing");
    setErrorMessage("");
    setPercent(0);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl }),
      });

      const data = await response.json();

      if (!response.ok || data.status === "error") {
        throw new Error(data.error || "Gagal memproses video.");
      }

      setPercent(100);
      setTimeout(() => {
        // Add to active queue (unshift to put on top)
        setActiveQueue(prev => [{ ...data, id: Date.now() }, ...prev]);
        setStatus("idle"); // Back to idle so user can paste next link immediately
        setUrl(""); // Clear input

        // Add to extraction history
        const newItem = {
          id: Date.now(),
          title: data.title,
          thumbnail: data.thumbnail,
          url: data.url,
          originalUrl: data.originalUrl || inputUrl,
          sourceUrl: inputUrl,
          resolutions: data.resolutions || [],
          timestamp: new Date().toLocaleString()
        };
        setExtractionHistory(prev => {
          const updated = [newItem, ...prev].slice(0, 20); // Limit to last 20
          localStorage.setItem("jekdownloader_extraction_history", JSON.stringify(updated));
          return updated;
        });
      }, 500);

    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Terjadi kesalahan server.");
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (url) processDownload(url);
  };

  const getCookie = (name) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const startDownloadTracking = (token, key) => {
    const interval = setInterval(() => {
      const cookieVal = getCookie("download_token");
      if (cookieVal === token) {
        setDownloadingIds(prev => ({ ...prev, [key]: false }));
        document.cookie = "download_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;";
        clearInterval(interval);
      }
    }, 1000);
    setTimeout(() => clearInterval(interval), 300000);
  };

  const triggerDownload = (item) => {
    if (downloadingIds[item.id]) return;
    const token = Math.random().toString(36).substring(7);
    setDownloadingIds(prev => ({ ...prev, [item.id]: true }));
    const selectedRes = selectedResolutions[item.id] || "auto";
    const downloadUrl = `/api/proxy?url=${encodeURIComponent(item.url)}&originalUrl=${encodeURIComponent(item.originalUrl || '')}&name=${encodeURIComponent(item.title)}&res=${selectedRes}&token=${token}`;
    const iframe = document.createElement('iframe');
    iframe.src = downloadUrl;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    startDownloadTracking(token, item.id);
    setTimeout(() => { try { document.body.removeChild(iframe); } catch { } }, 600000);
    handleDownloadClick(item, selectedRes, 'video');
  };

  const triggerAudioDownload = (item) => {
    const dlKey = `${item.id}_audio`;
    if (downloadingIds[dlKey]) return;
    const token = Math.random().toString(36).substring(7);
    setDownloadingIds(prev => ({ ...prev, [dlKey]: true }));
    const audioUrl = item.audio || item.url;
    const downloadUrl = `/api/proxy?url=${encodeURIComponent(audioUrl)}&originalUrl=${encodeURIComponent(item.originalUrl || '')}&name=${encodeURIComponent(item.title)}&type=audio&token=${token}`;
    const iframe = document.createElement('iframe');
    iframe.src = downloadUrl;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    startDownloadTracking(token, dlKey);
    setTimeout(() => { try { document.body.removeChild(iframe); } catch { } }, 600000);
    handleDownloadClick(item, null, 'audio');
  };

  const triggerImageDownload = (item, specificUrl = null, index = null) => {
    const imageUrl = specificUrl || item.thumbnail;
    if (!imageUrl) return;
    const dlKey = index !== null ? `${item.id}_img_${index}` : `${item.id}_image`;
    if (downloadingIds[dlKey]) return;
    const token = Math.random().toString(36).substring(7);
    setDownloadingIds(prev => ({ ...prev, [dlKey]: true }));
    const downloadUrl = `/api/proxy?url=${encodeURIComponent(imageUrl)}&name=${encodeURIComponent(item.title + (index !== null ? "_img_" + (index + 1) : ""))}&type=image&token=${token}`;
    const iframe = document.createElement('iframe');
    iframe.src = downloadUrl;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    startDownloadTracking(token, dlKey);
    setTimeout(() => { try { document.body.removeChild(iframe); } catch { } }, 60000);
    handleDownloadClick(item, null, 'image');
  };

  const handleDownloadClick = (item, selectedRes = null, downloadType = 'video') => {
    // Add to download history when button is clicked
    const downloadItem = {
      ...item,
      id: Date.now(),
      sourceUrl: item.sourceUrl || item.originalUrl || item.url,
      savedResolution: selectedRes,
      downloadType,
      timestamp: new Date().toLocaleString()
    };
    setDownloadHistory(prev => {
      const updated = [downloadItem, ...prev].slice(0, 20);
      localStorage.setItem("jekdownloader_download_history", JSON.stringify(updated));
      return updated;
    });
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const removeFromQueue = (id) => {
    setActiveQueue(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = (type) => {
    if (type === 'extraction') {
      localStorage.removeItem("jekdownloader_extraction_history");
      setExtractionHistory([]);
    } else {
      localStorage.removeItem("jekdownloader_download_history");
      setDownloadHistory([]);
    }
  };

  // Date Filter Helper
  const filterByDate = (items, filter, customFrom, customTo) => {
    if (filter === 'all') return items;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return items.filter(item => {
      const d = new Date(item.timestamp);
      if (isNaN(d.getTime())) return true;
      if (filter === 'today') return d >= startOfToday;
      if (filter === 'week') return d >= new Date(now - 7 * 86400000);
      if (filter === 'month') return d >= new Date(now - 30 * 86400000);
      if (filter === 'custom') {
        const from = customFrom ? new Date(customFrom) : new Date(0);
        const to = customTo ? new Date(new Date(customTo).getTime() + 86400000 - 1) : new Date();
        return d >= from && d <= to;
      }
      return true;
    });
  };

  // Get unique platforms from history items
  const getUniquePlatforms = (items) => {
    const set = new Set();
    items.forEach(item => {
      const p = getPlatform(item.sourceUrl || item.originalUrl || item.url);
      set.add(p.name);
    });
    return Array.from(set);
  };

  // Toggle item selection
  const toggleSelect = (id, selected, setSelected) => {
    const copy = new Set(selected);
    copy.has(id) ? copy.delete(id) : copy.add(id);
    setSelected(copy);
  };

  // Delete selected items
  const deleteSelectedItems = (type) => {
    if (type === 'extraction') {
      const updated = extractionHistory.filter(item => !linkSelected.has(item.id));
      setExtractionHistory(updated);
      localStorage.setItem("jekdownloader_extraction_history", JSON.stringify(updated));
      setLinkSelected(new Set());
      setLinkSelectMode(false);
    } else {
      const updated = downloadHistory.filter(item => !dlSelected.has(item.id));
      setDownloadHistory(updated);
      localStorage.setItem("jekdownloader_download_history", JSON.stringify(updated));
      setDlSelected(new Set());
      setDlSelectMode(false);
    }
  };

  // Share handler
  const handleShare = async (item) => {
    if (sharingId) return;

    const sourceUrl = item.originalUrl || item.sourceUrl || item.url;
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(item.url)}&originalUrl=${encodeURIComponent(item.originalUrl || '')}&name=${encodeURIComponent(item.title)}&mode=stream`;

    setSharingId(item.id);

    try {
      // 1. Fetch file as blob
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Gagal ambil file');
      const blob = await response.blob();

      // 2. Create File object
      const safeTitle = item.title.replace(/[^a-z0-9]/gi, '_').substring(0, 30);
      const file = new File([blob], `${safeTitle}.mp4`, { type: 'video/mp4' });

      // 3. Check if can share file
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: item.title,
          text: `Download video ini pake JekDownloader!`
        });
      } else {
        // Fallback: Share link if file share not supported
        if (navigator.share) {
          await navigator.share({ title: item.title, text: item.title, url: sourceUrl });
        } else {
          await navigator.clipboard.writeText(sourceUrl);
          alert('Berhasil disalin! 📋 (HP lu gak support share file)');
        }
      }
    } catch (error) {
      console.error('Share error:', error);
      // Final fallback to clipboard
      await navigator.clipboard.writeText(sourceUrl);
      alert('Link disalin! 📋 (Gagal nyiapin file video)');
    } finally {
      setSharingId(null);
    }
  };

  // Render Views
  const renderHome = () => (
    <>
      <form className="glass-card fade-in-up" onSubmit={handleManualSubmit} style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 12, fontWeight: 500, fontSize: '1rem', color: 'rgba(255,255,255,0.8)' }}>
          Mau download video apa nih, bang?
        </h3>
        <input
          type="url"
          className="input-field"
          placeholder="Paste link video (TikTok/Youtube/etc)..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary" disabled={status === "processing"}>
          {status === "processing" ? `Sabar ya... (${percent}%)` : "Hajar!!!"}
        </button>
      </form>

      {status === "error" && (
        <div className="glass-card fade-in-up" style={{ marginBottom: 20, textAlign: 'center', borderColor: 'rgba(255,69,58,0.3)' }}>
          <h3 style={{ color: '#ff453a', marginBottom: 8 }}>Waduh, Error!</h3>
          <p className="hero-subtitle">{errorMessage}</p>
          <button onClick={() => { setStatus("idle"); setErrorMessage(""); }} className="btn-primary" style={{ marginTop: 10 }}>Coba Lagi</button>
        </div>
      )}

      {activeQueue.map((item) => (
        <div key={item.id} className="glass-card hero-card fade-in-up" style={{ marginBottom: 20, position: 'relative' }}>
          <button
            onClick={() => removeFromQueue(item.id)}
            style={{ position: 'absolute', top: 15, right: 15, background: 'none', border: 'none', color: '#999', cursor: 'pointer', zIndex: 10 }}
          >✕</button>

          <h2 className="hero-title">
            {item.title}
          </h2>
          <p className="hero-subtitle" style={{ color: '#8B5CF6' }}>
            (Ready to save!)
          </p>

          <div className="hero-content">
            <img src={getProxiedThumbnail(item.thumbnail) || "https://placehold.co/100x100/222/444?text=Media"} alt="Thumb" className="hero-thumbnail" />

            <div className="hero-status">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3A82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <p>Ekstrak Berhasil!</p>
            </div>
          </div>

          <div className="action-row" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Row 1: Resolution + Video Download */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {item.resolutions && item.resolutions.length > 0 && (
                <select
                  value={selectedResolutions[item.id] || "auto"}
                  onChange={(e) => setSelectedResolutions(prev => ({ ...prev, [item.id]: e.target.value }))}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff', outline: 'none'
                  }}
                >
                  <option value="auto" style={{ color: '#000' }}>Auto (Best Quality)</option>
                  {item.resolutions.map(res => (
                    <option key={res} value={res} style={{ color: '#000' }}>
                      {isNaN(res) ? res : `${res}p`}
                    </option>
                  ))}
                </select>
              )}
              {item.url && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <button
                    className="btn-action"
                    style={{ width: '100%', opacity: downloadingIds[item.id] ? 0.7 : 1 }}
                    onClick={() => triggerDownload(item)}
                    disabled={downloadingIds[item.id]}
                  >
                    {downloadingIds[item.id] ? (
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', animation: 'pulse 1.5s infinite' }}>Menyiapkan...</span>
                    ) : (
                      <><DownloadIcon active={false} /> <span style={{ fontSize: '0.75rem' }}>Video</span></>
                    )}
                  </button>
                  {downloadingIds[item.id] && (
                    <div className="fade-in-up" style={{ marginTop: 4 }}>
                      <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: '50%', height: '100%', background: '#3A82F6', animation: 'indeterminate-bar 1.5s infinite linear', borderRadius: 4 }}></div>
                      </div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: 4, lineHeight: 1.3 }}>
                        Mohon tunggu 1-5 menit...
                        <span style={{ color: '#3A82F6', cursor: 'pointer', textDecoration: 'underline', marginLeft: 6 }} onClick={() => setDownloadingIds(prev => ({ ...prev, [item.id]: false }))}>Reset</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Carousel Images Section */}
            {item.images && item.images.length > 0 && (
              <div style={{ marginTop: 20, animation: 'fadeInUp 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <ImageIcon />
                  <h4 style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Carousel / Galeri Gambar ({item.images.length})</h4>
                </div>
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                  gap: 12, maxHeight: 300, overflowY: 'auto', paddingRight: 4, paddingBottom: 10
                }}>
                  {item.images.map((imgUrl, idx) => {
                    const dlKey = `${item.id}_img_${idx}`;
                    const isDownloading = downloadingIds[dlKey];
                    return (
                      <div key={idx} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', height: 80 }}>
                        <img src={getProxiedThumbnail(imgUrl)} alt={`slide-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          onClick={() => triggerImageDownload(item, imgUrl, idx)}
                          style={{
                            position: 'absolute', inset: 0, width: '100%', height: '100%',
                            background: isDownloading ? 'rgba(16,185,129,0.4)' : 'rgba(0,0,0,0.3)',
                            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                        >
                          {isDownloading ? (
                            <div className="spinner-small" style={{ borderTopColor: '#fff', width: 20, height: 20, borderWidth: 2 }}></div>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Row 2: Audio + Image Download */}
            <div style={{ display: 'flex', gap: 10 }}>
              {item.url && (
                <button
                  className="btn-action"
                  style={{
                    flex: 1, gap: 6,
                    background: downloadingIds[`${item.id}_audio`] ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.1)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    opacity: downloadingIds[`${item.id}_audio`] ? 0.7 : 1,
                    padding: '10px 12px'
                  }}
                  onClick={() => triggerAudioDownload(item)}
                  disabled={downloadingIds[`${item.id}_audio`]}
                >
                  {downloadingIds[`${item.id}_audio`] ? (
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', animation: 'pulse 1.5s infinite', color: '#8B5CF6' }}>Menyiapkan...</span>
                  ) : (
                    <><AudioIcon /> <span style={{ fontSize: '0.75rem' }}>Audio (MP3)</span></>
                  )}
                </button>
              )}
              {item.thumbnail && (
                <button
                  className="btn-action"
                  style={{
                    flex: 1, gap: 6,
                    background: downloadingIds[`${item.id}_image`] ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    opacity: downloadingIds[`${item.id}_image`] ? 0.7 : 1,
                    padding: '10px 12px'
                  }}
                  onClick={() => triggerImageDownload(item)}
                  disabled={downloadingIds[`${item.id}_image`]}
                >
                  {downloadingIds[`${item.id}_image`] ? (
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', animation: 'pulse 1.5s infinite', color: '#10B981' }}>Menyiapkan...</span>
                  ) : (
                    <><ImageIcon /> <span style={{ fontSize: '0.75rem' }}>Gambar</span></>
                  )}
                </button>
              )}
            </div>

            {/* Loading bar untuk Audio */}
            {downloadingIds[`${item.id}_audio`] && (
              <div className="fade-in-up">
                <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '50%', height: '100%', background: '#8B5CF6', animation: 'indeterminate-bar 1.5s infinite linear', borderRadius: 4 }}></div>
                </div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: 4 }}>
                  Mengekstrak audio...
                  <span style={{ color: '#8B5CF6', cursor: 'pointer', textDecoration: 'underline', marginLeft: 6 }} onClick={() => setDownloadingIds(prev => ({ ...prev, [`${item.id}_audio`]: false }))}>Reset</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );

  const renderExtractionHistory = () => {
    let filtered = filterByDate(extractionHistory, linkDateFilter, linkCustomFrom, linkCustomTo);
    if (linkPlatformFilter !== 'all') {
      filtered = filtered.filter(item => getPlatform(item.sourceUrl || item.originalUrl || item.url).name === linkPlatformFilter);
    }
    const allPlatforms = getUniquePlatforms(extractionHistory);

    return (
      <div className="fade-in-up">
        <h2 style={{ marginBottom: 16 }}>Riwayat Link</h2>
        <FilterBar
          dateFilter={linkDateFilter}
          setDateFilter={setLinkDateFilter}
          customFrom={linkCustomFrom}
          setCustomFrom={setLinkCustomFrom}
          customTo={linkCustomTo}
          setCustomTo={setLinkCustomTo}
          platformFilter={linkPlatformFilter}
          setPlatformFilter={setLinkPlatformFilter}
          platforms={allPlatforms}
          onClearAll={() => clearHistory('extraction')}
          onDeleteSelected={() => deleteSelectedItems('extraction')}
          itemCount={filtered.length}
          selectMode={linkSelectMode}
          setSelectMode={(v) => { setLinkSelectMode(v); if (!v) setLinkSelected(new Set()); }}
          selectedCount={linkSelected.size}
        />
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 40, color: 'var(--text-secondary)' }}>
            <SearchIcon active={false} />
            <p style={{ marginTop: 10 }}>Belum ada riwayat pengekstrakkan.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const platform = getPlatform(item.sourceUrl || item.originalUrl || item.url);
            return (
              <div key={item.id} className="list-card" style={{ position: 'relative' }}>
                {linkSelectMode && (
                  <input type="checkbox" checked={linkSelected.has(item.id)} onChange={() => toggleSelect(item.id, linkSelected, setLinkSelected)}
                    style={{ width: 20, height: 20, marginRight: 10, accentColor: '#3A82F6', cursor: 'pointer', flexShrink: 0 }}
                  />
                )}
                <div className="list-icon">
                  {item.thumbnail ? <img src={getProxiedThumbnail(item.thumbnail)} alt="thumb" onError={e => { e.target.style.display = 'none'; }} /> : <HistoryIcon active={false} />}
                </div>
                <div className="list-details" style={{ flex: 1 }}>
                  <h4>{item.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '2px 8px', borderRadius: 6, fontSize: '0.6rem', fontWeight: 'bold',
                      background: `${platform.color}22`, color: platform.color, border: `1px solid ${platform.color}44`
                    }}>
                      {platform.emoji} {platform.name}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{item.timestamp}</span>
                  </div>
                </div>
                {!linkSelectMode && (
                  <button onClick={() => { setUrl(item.originalUrl || item.url); processDownload(item.originalUrl || item.url); setActiveTab('home'); }} className="btn-action" style={{ padding: '8px 12px', minWidth: 40 }}> ↻ </button>
                )}
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderDownloadHistory = () => {
    let filtered = filterByDate(downloadHistory, dlDateFilter, dlCustomFrom, dlCustomTo);
    if (dlPlatformFilter !== 'all') {
      filtered = filtered.filter(item => getPlatform(item.sourceUrl || item.originalUrl || item.url).name === dlPlatformFilter);
    }
    const allPlatforms = getUniquePlatforms(downloadHistory);

    return (
      <div className="fade-in-up">
        <h2 style={{ marginBottom: 16 }}>Riwayat Download</h2>
        <FilterBar
          dateFilter={dlDateFilter}
          setDateFilter={setDlDateFilter}
          customFrom={dlCustomFrom}
          setCustomFrom={setDlCustomFrom}
          customTo={dlCustomTo}
          setCustomTo={setDlCustomTo}
          platformFilter={dlPlatformFilter}
          setPlatformFilter={setDlPlatformFilter}
          platforms={allPlatforms}
          onClearAll={() => clearHistory('download')}
          onDeleteSelected={() => deleteSelectedItems('download')}
          itemCount={filtered.length}
          selectMode={dlSelectMode}
          setSelectMode={(v) => { setDlSelectMode(v); if (!v) setDlSelected(new Set()); }}
          selectedCount={dlSelected.size}
        />
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 40, color: 'var(--text-secondary)' }}>
            <DownloadIcon active={false} />
            <p style={{ marginTop: 10 }}>Belum ada riwayat download file.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const platform = getPlatform(item.sourceUrl || item.originalUrl || item.url);
            const isExpanded = expandedDownloadId === item.id;
            return (
              <div key={item.id} style={{ marginBottom: 8 }}>
                <div
                  className="list-card"
                  style={{ cursor: 'pointer', marginBottom: 0, borderRadius: isExpanded ? '16px 16px 0 0' : 16, transition: 'border-radius 0.2s' }}
                  onClick={() => !dlSelectMode && setExpandedDownloadId(isExpanded ? null : item.id)}
                >
                  {dlSelectMode && (
                    <input type="checkbox" checked={dlSelected.has(item.id)} onChange={() => toggleSelect(item.id, dlSelected, setDlSelected)}
                      style={{ width: 20, height: 20, marginRight: 10, accentColor: '#3A82F6', cursor: 'pointer', flexShrink: 0 }}
                      onClick={e => e.stopPropagation()}
                    />
                  )}
                  <div className="list-icon">
                    {item.thumbnail ? <img src={getProxiedThumbnail(item.thumbnail)} alt="thumb" onError={e => { e.target.style.display = 'none'; }} /> : <DownloadIcon active={false} />}
                  </div>
                  <div className="list-details" style={{ flex: 1 }}>
                    <h4>{item.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '2px 8px', borderRadius: 6, fontSize: '0.6rem', fontWeight: 'bold',
                        background: `${platform.color}22`, color: platform.color, border: `1px solid ${platform.color}44`
                      }}>
                        {platform.emoji} {platform.name}
                      </span>
                      {item.savedResolution && (
                        <span style={{ fontSize: '0.6rem', color: '#3A82F6', background: 'rgba(58,130,246,0.15)', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(58,130,246,0.2)', fontWeight: 'bold' }}>
                          {item.savedResolution === 'auto' ? 'Otomatis' : `${item.savedResolution}p`}
                        </span>
                      )}
                      <span style={{
                        fontSize: '0.6rem',
                        color: item.downloadType === 'audio' ? '#8B5CF6' : item.downloadType === 'image' ? '#10B981' : '#3A82F6',
                        background: item.downloadType === 'audio' ? 'rgba(139,92,246,0.15)' : item.downloadType === 'image' ? 'rgba(16,185,129,0.15)' : 'rgba(58,130,246,0.15)',
                        padding: '2px 6px', borderRadius: 4,
                        border: `1px solid ${item.downloadType === 'audio' ? 'rgba(139,92,246,0.2)' : item.downloadType === 'image' ? 'rgba(16,185,129,0.2)' : 'rgba(58,130,246,0.2)'}`,
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {item.downloadType === 'audio' ? 'Audio' : item.downloadType === 'image' ? 'Gambar' : 'Video'}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{item.timestamp}</span>
                    </div>
                  </div>
                  {!dlSelectMode && (
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                  )}
                </div>
                {isExpanded && (
                  <div style={{
                    padding: '14px 16px', borderRadius: '0 0 16px 16px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderTop: 'none',
                    animation: 'fadeInUp 0.2s ease'
                  }}>
                    {item.downloadType === 'audio' ? (
                      <div style={{ background: '#000', borderRadius: 12, padding: 16, marginBottom: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <audio
                          controls
                          style={{ width: '100%' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <source src={`/api/proxy?url=${encodeURIComponent(item.audio || item.url)}&originalUrl=${encodeURIComponent(item.originalUrl || '')}&name=${encodeURIComponent(item.title)}&type=audio&mode=stream`} type="audio/mpeg" />
                          Browser lu gak support audio player.
                        </audio>
                      </div>
                    ) : item.downloadType === 'image' ? (
                      <img
                        src={`/api/proxy?url=${encodeURIComponent(item.url)}&name=${encodeURIComponent(item.title)}&type=image`}
                        alt={item.title}
                        style={{ width: '100%', borderRadius: 12, marginBottom: 12, background: '#000', maxHeight: 300, objectFit: 'contain' }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : item.url ? (
                      <video
                        controls
                        playsInline
                        preload="metadata"
                        poster={getProxiedThumbnail(item.thumbnail)}
                        style={{
                          width: '100%', borderRadius: 12, marginBottom: 12,
                          background: '#000', maxHeight: 300
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <source src={`/api/proxy?url=${encodeURIComponent(item.url)}&originalUrl=${encodeURIComponent(item.originalUrl || '')}&name=${encodeURIComponent(item.title)}&mode=stream`} type="video/mp4" />
                        Browser lu gak support video player.
                      </video>
                    ) : null}
                    <p style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: 10 }}>📌 Lokasi: Memori Internal / Download</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn-action"
                        style={{ flex: 1, padding: '10px', justifyContent: 'center' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.downloadType === 'audio') triggerAudioDownload(item);
                          else if (item.downloadType === 'image') triggerImageDownload(item, item.url, 0);
                          else triggerDownload(item);
                        }}
                      >
                        <DownloadIcon active={false} /> Download Ulang
                      </button>
                      <button
                        className="btn-action"
                        style={{
                          flex: 0.5, padding: '10px', justifyContent: 'center',
                          background: 'rgba(58, 130, 246, 0.1)', border: '1px solid rgba(58, 130, 246, 0.3)',
                          color: '#3A82F6', opacity: sharingId === item.id ? 0.6 : 1
                        }}
                        onClick={(e) => { e.stopPropagation(); handleShare(item); }}
                        disabled={sharingId === item.id}
                      >
                        {sharingId === item.id ? (
                          <>⌛ Sharing...</>
                        ) : (
                          <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>
                            Share
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderSettings = () => (
    <div className="fade-in-up" style={{ paddingBottom: 20 }}>
      {/* SECTION: APPLICATION */}
      <div style={{ marginBottom: 8, paddingLeft: 8 }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tentang Aplikasi</p>
      </div>
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
        <button
          onClick={() => setIsChangelogOpen(true)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '16px 20px',
            background: 'none',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'background 0.2s',
            borderBottom: '1px solid var(--glass-border)'
          }}
          className="btn-row-hover"
        >
          <div className="list-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <InfoIcon />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>JekDownloader v{changelogData[0].version}</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>Lihat apa yang baru di versi ini</p>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.2)' }}>
            <ChevronRightIcon />
          </div>
        </button>

        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="list-icon" style={{ background: 'rgba(58, 130, 246, 0.15)', color: 'var(--accent-blue)' }}>
            <ShieldIcon />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 500 }}>Keamanan & Privasi</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Server-side extraction aktif</p>
          </div>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
        </div>
      </div>

      {/* SECTION: DEVICE & PWA */}
      <div style={{ marginBottom: 8, paddingLeft: 8 }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Akses Cepat</p>
      </div>
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div className="list-icon" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#fff' }}>
              <MonitorIcon />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 500 }}>Pasang Aplikasi</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Simpan JekDownloader ke Layar Utama HP</p>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="btn-primary"
            style={{
              marginTop: 0,
              padding: '14px',
              fontSize: '0.9rem',
              background: (deferredPrompt && !isIOS) ? 'linear-gradient(135deg, #3A82F6, #8B5CF6)' : 'rgba(255,255,255,0.05)',
              border: (deferredPrompt && !isIOS) ? 'none' : '1px solid var(--glass-border)',
              boxShadow: (deferredPrompt && !isIOS) ? '0 4px 15px rgba(58, 130, 246, 0.3)' : 'none'
            }}
          >
            {isIOS ? "User iPhone? (Klik Share -> Add to Home Screen)" : (deferredPrompt ? "Tambahkan ke Layar Utama" : "Buka Menu Browser -> Install")}
          </button>
        </div>
      </div>

      {/* SECTION: DATA MANAGEMENT */}
      <div style={{ marginBottom: 8, paddingLeft: 8 }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data Management</p>
      </div>
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--glass-border)' }}>
          <div className="list-icon" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff' }}>
            <DatabaseIcon />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 500 }}>Riwayat Link</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{extractionHistory.length} entri tersimpan</p>
          </div>
          <button onClick={() => clearHistory('extraction')} className="btn-install" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '6px 14px', borderRadius: 12 }}>
            Hapus
          </button>
        </div>

        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="list-icon" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff' }}>
            <TerminalIcon />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 500 }}>Riwayat File</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{downloadHistory.length} file diunduh</p>
          </div>
          <button onClick={() => clearHistory('download')} className="btn-install" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '6px 14px', borderRadius: 12 }}>
            Hapus
          </button>
        </div>
      </div>

      <div style={{ marginTop: 32, textAlign: 'center', padding: '0 20px' }}>
        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
          Dibuat dengan ❤️ untuk kemudahan download.<br />
          JekDownloader © 2026
        </p>
      </div>
    </div>
  );


  return (
    <div className="app-container">
      {/* Dynamic Background Blur - using top item from queue */}
      {activeTab === 'home' && activeQueue.length > 0 && (
        <div className="bg-cover-blur" style={{ backgroundImage: `url(${getProxiedThumbnail(activeQueue[0].thumbnail)})` }} />
      )}

      {/* Header */}
      <header className="header" style={{ zIndex: 10 }}>
        <CloudIcon />
        <h1>JekDownloader</h1>
      </header>

      {/* Main Content Render based on active tab */}
      <main style={{ position: 'relative', zIndex: 10 }}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'search' && renderExtractionHistory()}
        {activeTab === 'download' && renderDownloadHistory()}
        {activeTab === 'settings' && renderSettings()}
      </main>

      {/* PWA Install Promotion Overlay (JekDownloader Signature Style) */}
      {showInstallPrompt && (
        <div
          className="fade-in-up"
          style={{
            position: 'fixed',
            bottom: 95, // Above bottom nav
            left: 12,
            right: 12,
            zIndex: 5000,
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: 24,
            padding: '24px',
            border: '1px solid rgba(58, 130, 246, 0.3)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0,
              boxShadow: '0 4px 12px rgba(58, 130, 246, 0.3)'
            }}>
              {isIOS ? <ShareIcon /> : <MonitorIcon />}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Install JekDownloader</h3>
                <button
                  onClick={() => { setShowInstallPrompt(false); sessionStorage.setItem("jekdownloader_install_dismissed", "1"); }}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem', cursor: 'pointer', padding: '0 4px' }}
                >✕</button>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
                Nikmati akses lebih cepat, layar penuh, dan fitur offline. 100% Aman & Ringan.
              </p>
            </div>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.2)', borderRadius: 16, padding: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
            {isIOS ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</div>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Tekan tombol <strong>Share</strong> <ShareIcon /> di bar menu</p>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</div>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Pilih <strong>Add to Home Screen</strong> <PlusSquareIcon /></p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className="btn-primary"
                style={{ marginTop: 0, padding: '12px', width: '100%', fontSize: '0.9rem', fontWeight: 700, borderRadius: 12 }}
              >
                Install Sekarang
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}><HomeIcon active={activeTab === 'home'} /></div>
        <div className={`nav-item ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}><SearchIcon active={activeTab === 'search'} /></div>
        <div className={`nav-item ${activeTab === 'download' ? 'active' : ''}`} onClick={() => setActiveTab('download')}><DownloadIcon active={activeTab === 'download'} /></div>
        <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><SettingsIcon active={activeTab === 'settings'} /></div>
      </nav>

      <ChangelogModal isOpen={isChangelogOpen} onClose={() => setIsChangelogOpen(false)} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}><div className="spinner-glow" /></div>}>
      <DownloaderApp />
    </Suspense>
  );
}

# CHANGELOG

Semua perubahan gokil di JekDownloader bakal dicatet di sini biar gak lupa sejarah!

## [1.3] - 2026-04-30
### Added
- **TikTok CDN Bypass**: Fix error 403 Forbidden pas download audio/video TikTok. Sekarang link CDN disikat langsung sampe dapet!
- **Audio History Player**: Di riwayat download sekarang muncul Audio Player minimalis buat file MP3. Gak ada lagi layar video item yang ngga jelas.
- **Smart Re-download**: Tombol "Download Ulang" sekarang pinter. Kalo lu download audio, dia narik audio lagi. Gak bakal nyasar jadi video lagi!
- **Iframe Scraper**: Mesin baru buat nembus web-web embed (kayak web anime/film). Kalau link utama gagal, sistem bakal bongkar HTML buat nyari video yang ngumpet!

### Improved
- **Resolution Selector**: Fitur pilih kualitas video (HD, SD, 1080p, dll) dikembalikan lagi agar user bisa menghemat kuota.
- **Pure Audio Engine**: Perbaikan sistem download audio YouTube yang sebelumnya masih mengikutkan stream video. Sekarang murni MP3.
- **Keamanan Publik**: Seluruh pesan error dari sistem disensor total (sanitasi path server) agar tidak mengungkap struktur direktori ke publik.
- **Premium Settings**: Perombakan total tampilan menu Setelan dengan gaya *Grouped List* yang modern dan ikonik (ala SholatKu).
- **Smart PWA Popup**: Sistem deteksi cerdas untuk perangkat iOS yang otomatis menampilkan panduan "Add to Home Screen" dengan langkah yang rapi.
- **Pembersihan Sistem**: Menghapus seluruh artefak kode lama dan file sampah untuk menjaga performa server tetap ringan.

---

## [1.2] - 2026-04-16
### Added
- **Riwayat Dipisah**: Sekarang ada tab khusus riwayat link (Kaca Pembesar) sama riwayat file (Tombol Download). Biar gak campur aduk kyk gado-gado!
- **Input Gak Pelit**: Form input download-nya sekarang standby terus di atas. Gak perlu nunggu hasil ilang buat download video lain. Sat set wat wet!
- **PWA Makin Gacor**: Popup install-nya sekarang lebih pinter. Kalo Chrome malu-malu munculin install, udah ada tombol manual di Setting.
- **Icon HD**: Pake icon baru yang bening parah biar ganteng pas nangkring di Home Screen HP lu.

---

## [1.1] - 2026-04-14
### Added
- **Mesin Gahar**: Ganti pake `yt-dlp` biar bisa download dari mana aja. Video kucing sampe video klip metal, sikat semua!
- **Desain Premium**: Tampilan glassmorphism ala-ala aplikasi mahal biar betah liatnya.
- **Tunneling**: Udah bisa diakses dari mana aja lewat domain `jekdownloader.ajekkk.my.id`. Gak perlu ribet buka localhost lagi.
- **Share To App**: Fitur paling sakti. Tinggal klik 'Share' di aplikasi laen, pilih JekDownloader, langsung ke-ekstrak sendiri!

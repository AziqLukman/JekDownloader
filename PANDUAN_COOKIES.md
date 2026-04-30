# Panduan Bypass Login Instagram (DPAPI Fix)

Dikarenakan keamanan baru Windows (App-Bound Encryption), JekDownloader **sudah tidak bisa** otomatis nyedot cookie dari Google Chrome maupun Microsoft Edge. 

Namun tenang saja! JekDownloader sekarang support 2 cara alternatif. **Silakan pilih salah satu cara di bawah ini yang menurut abang paling gampang:**

---

## Opsi 1: Pindah Login IG ke Mozilla Firefox (Paling Gampang & Otomatis)
Ini cara paling direkomendasikan karena abang gak perlu pusing berurusan dengan kode-kode. Firefox adalah satu-satunya browser besar yang belum dikunci mati oleh Windows.

1. Buka browser **Mozilla Firefox** (Kalau belum punya, [Download Firefox di sini](https://www.mozilla.org/id/firefox/new/)).
2. Buka `https://www.instagram.com` dan **Login** pakai akun abang.
3. Kalau udah berhasil masuk beranda IG, abang bisa tutup Firefox-nya atau dibiarin kebuka, bebas!
4. Langsung tes download IG pakai **JekDownloader**. Sistem bakal otomatis narik data dari Firefox abang selamanya tanpa perlu setting apa-apa lagi!

---

## Opsi 2: Copy-Paste Cookie Chrome Secara Manual (Ribet di awal)
Pilih opsi ini kalau abang **benar-benar tidak mau install Firefox** dan rela melakukan ini manual sebulan sekali kalau error lagi.

1. Buka Google Chrome dan login ke Instagram seperti biasa.
2. Saat layar Chrome lagi ngebuka IG, tekan tombol **F12** di keyboard buat buka panel *Developer Tools*.
3. Di panel yang kebuka, pilih tab **Network** (Jaringan).
4. Tekan **F5** buat *Refresh* halaman webnya. Nanti bakal muncul banyak teks ber-gerak-gerak di panel.
5. Klik baris **paling atas** (biasanya tulisannya `www.instagram.com` atau cuma `/`).
6. Di sebelah kanannya, geser sedikit ke bawah cari bagian **Request Headers**.
7. Di bawahnya, cari tulisan **`cookie:`** (huruf kecil semua).
8. Klik kanan di tulisan kodenya yang panjang banget, lalu pilih **Copy value**.
9. Buat file teks baru di folder JekDownloader abang (`C:\Users\kenry\.gemini\antigravity\playground\static-hypernova\jek-downloader\`) dan kasih nama persis: **`cookie_string.txt`**.
10. Buka file itu pakai Notepad, **Paste** (Ctrl+V) kodenya ke sana, lalu Save.
11. Selesai! Coba tes JekDownloader-nya.

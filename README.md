# Menu Dapur Ulul

## GitHub Pages

Aktifkan Pages dari branch `main` dan folder `/root`. Halaman utama tersedia di:
`https://cloudgaming43-wq.github.io/menu-dapur-ulul/`

## Google Sheets dan Admin

1. Buat Google Sheet baru, lalu buka **Extensions > Apps Script**.
2. Salin isi `apps-script/Code.gs` ke editor Apps Script.
3. Ganti `GANTI_DENGAN_TOKEN_RAHASIA` dengan token buatan sendiri, lalu jalankan fungsi `setup` sekali.
4. Pilih **Deploy > New deployment > Web app**, jalankan sebagai akun Anda, dan izinkan akses **Anyone**.
5. Buka `admin.html`, isi URL Web App dan token, lalu klik **Simpan Pengaturan**.
6. Salin URL Web App ke variabel `sheetsApiUrl` di `index.html`, commit, dan push ulang.

Halaman admin: `https://cloudgaming43-wq.github.io/menu-dapur-ulul/admin.html`

GitHub Pages bersifat statis. Token di halaman admin bukan sistem keamanan tingkat produksi, jadi gunakan hanya untuk pengelolaan sederhana dan jangan simpan data sensitif di Sheet.

## Auto-sync ke GitHub

Jalankan PowerShell dari folder repository:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\auto-sync.ps1
```

Biarkan jendela PowerShell tetap terbuka. Setiap perubahan file akan otomatis dibuatkan commit dan di-push ke branch `main` setiap beberapa detik. Tekan `Ctrl+C` untuk menghentikan watcher.

Untuk menjalankannya otomatis saat login Windows, buat shortcut ke perintah berikut di folder Startup (`Win+R` lalu ketik `shell:startup`):

```text
powershell.exe -ExecutionPolicy Bypass -File "E:\Menu Dapur Ulul\Menu Dapur Ulul\auto-sync.ps1"
```

# 🚀 Maintenance Tracker App API (v1)

REST API backend berbasis Node.js, Express, TypeScript, Supabase (PostgreSQL), dan Cloudinary untuk aplikasi pelacak servis kendaraan dan gadget personal. API ini telah dilengkapi dengan sistem keamanan autentikasi berbasis Token (JWT).

## 📂 Struktur Proyek Terimplementasi
```text
.
├── package.json
├── README.md
├── tsconfig.json
└── src
    ├── config
    │   ├── cloudinary.ts
    │   └── supabase.ts
    ├── controllers
    │   ├── auth.controller.ts        # Logika Class Register & Login
    │   └── maintenance.controller.ts # Logika Class CRUD Servis Terproteksi
    ├── middlewares
    │   ├── auth.middleware.ts        # Verifikasi Token Keamanan JWT
    │   └── upload.ts                 # Multer Memory Storage untuk Gambar
    ├── routes
    │   └── maintenance.route.ts      # Jalur Endpoint API
    ├── services
    │   └── cloudinary.service.ts     # Upload ke Cloudinary
    ├── types
    │   └── maintenance.types.ts      # Definisi Tipe Data TypeScript
    └── index.ts                      # Entry Point Utama Aplikasi (/api/v1)
```

## ⚙️ Panduan Instalasi & Penggunaan Lokal

### 1. Masuk ke Direktori Project
```bash
cd restapi-management-product
```

### 2. Konfigurasi Environment Variables
Salin contoh konfigurasi ke file `.env` baru:
```bash
cp .env.example .env
```
> ⚠️ **Penting:** Buka file `.env` dan lengkapi kredensial berikut:
> * `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY` (Gunakan kunci *service_role* agar bypass RLS backend aman).
> * `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, & `CLOUDINARY_API_SECRET`.
> * `JWT_SECRET` (Isi string acak bebas untuk kunci enkripsi token login).

### 3. Instalasi Dependencies
```bash
npm install
```

### 4. Menjalankan Server (Development Mode)
```bash
npm run dev
```
Server akan berjalan otomatis di `http://localhost:8000`.

## 📡 Dokumentasi Endpoint API (Base URL: `/api/v1`)

### 🔓 Public Endpoints (Tanpa Login)
* **`POST /auth/register`** : Pendaftaran akun baru. Menerima JSON (`username`, `email`, `password`).
* **`POST /auth/login`** : Proses masuk log. Menerima JSON (`email`, `password`). Mengembalikan string `token` JWT.

### 🔒 Protected Endpoints (Wajib Melampirkan `Bearer Token`)
* **`GET /maintenances`** : Mengambil semua data riwayat servis milik user yang sedang login.
* **`GET /maintenances/:id`** : Mengambil detail satu data servis berdasarkan ID.
* **`POST /maintenances`** : Menambah catatan servis baru. Menerima `form-data` teks dan file fisik (`image`). Gambar otomatis diunggah ke Cloudinary dan link disimpan ke Supabase.
* **`PUT /maintenances/:id`** : Memperbarui data servis. Otomatis mengganti gambar lama di Cloudinary jika ada unggahan gambar baru.
* **`DELETE /maintenances/:id`** : Menghapus catatan servis di Supabase sekaligus menghapus file gambarnya secara otomatis di Cloudinary.


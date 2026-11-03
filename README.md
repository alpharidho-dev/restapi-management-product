# restapi-management-product
Rest Api Express.js + TypeScript for management product koke2 &amp; koke3 school project

# 🚀 Panduan Instalasi & Menjalankan Project

Ikuti langkah-langkah di bawah ini untuk memasang dan menjalankan REST API Management Product di lingkungan lokal Anda.

### 1. Masuk ke Direktori Project
Buka terminal atau command prompt, lalu masuk ke folder project utama:
```bash
cd restapi-management-product
```

### 2. Konfigurasi Environment Variables
Salin file contoh konfigurasi `.env.example` menjadi file `.env` baru:
```bash
cp .env.example .env
```
> 💡 **Catatan:** Setelah menyalin, buka file `.env` yang baru dibuat dan isi kredensial yang diperlukan seperti URL & Anon Key untuk **Supabase**, serta konfigurasi API untuk **Cloudinary**.

### 3. Instalasi Dependencies
Unduh dan pasang semua *package/node modules* yang dibutuhkan oleh aplikasi:
```bash
npm install
```

### 4. Menjalankan Server (Development Mode)
Nyalakan server REST API dalam mode pengembangan dengan fitur *auto-reload* (nodemon/ts-node-dev):
```bash
npm run dev
```

Server akan otomatis berjalan di port yang telah ditentukan (contoh: `http://localhost:8000`). Anda sudah bisa melakukan testing API pake Postman atau aplikasi frontend

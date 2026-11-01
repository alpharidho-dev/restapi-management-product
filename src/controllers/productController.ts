import { Response } from 'express';
import { desc } from 'drizzle-orm';
import { db } from '../config/db';
import { products } from '../schema';
import { AuthRequest } from '../middlewares/auth';

export const createProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { name, category, price, stock, description } = req.body;

  if (!req.file) {
    res.status(400).json({ message: 'Gambar produk wajib diunggah' });
    return;
  }

  if (!name || !category || !price || !stock) {
    res.status(400).json({ message: 'Field wajib tidak boleh kosong' });
    return;
  }

  try {
    const imageUrl = (req.file as any).path;

    await db.insert(products).values({
      name,
      category,
      price: String(price),
      stock: Number(stock),
      description: description || '',
      imageUrl,
    });

    res.status(201).json({
      message: 'Produk berhasil ditambahkan',
      imageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menambahkan produk' });
  }
};

export const getProducts = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const rows = await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt));

    res.json({
      message: 'Daftar produk',
      total: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data produk' });
  }
};
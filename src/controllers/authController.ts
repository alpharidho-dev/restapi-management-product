import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { users } from '../schema';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: 'Semua field wajib diisi' });
    return;
  }

  try {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      res.status(409).json({ message: 'Email sudah terdaftar' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email dan password wajib diisi' });
    return;
  }

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (result.length === 0) {
      res.status(401).json({ message: 'Email atau password salah' });
      return;
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: 'Email atau password salah' });
      return;
    }

    const signOptions: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN ||
        '1h') as SignOptions['expiresIn'],
    };

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET as string,
      signOptions
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
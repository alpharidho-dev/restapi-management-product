import 'dotenv/config';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from '../schema';

const poolConnection = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'product_db',
  waitForConnections: true,
  connectionLimit: 10,
  allowPublicKeyRetrieval: true, // Penting untuk MySQL 8
} as any);

export const db = drizzle(poolConnection, { schema, mode: 'default' });

export const testConnection = async (): Promise<void> => {
  try {
    const conn = await poolConnection.getConnection();
    console.log('✅ Database connected');
    conn.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
};
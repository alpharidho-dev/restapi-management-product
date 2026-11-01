import 'dotenv/config';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './schema';

const user = process.env.DB_USER || 'admin';
const pass = process.env.DB_PASSWORD || 'admin123';
const host = process.env.DB_HOST || '127.0.0.1';
const name = process.env.DB_NAME || 'product_db';

const connectionUri = `mysql://${user}:${pass}@${host}:3306/${name}`;

const poolConnection = mysql.createPool(connectionUri);

export const db = drizzle(poolConnection, { schema, mode: 'default' });

export const testConnection = async (): Promise<void> => {
  try {
    const conn = await poolConnection.getConnection();
    console.log('Database connected');
    conn.release();
  } catch (err) {
    console.error('Database connection failed:', err);
  }
};
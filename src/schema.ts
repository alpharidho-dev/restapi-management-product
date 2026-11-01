import {
  mysqlTable,
  int,
  varchar,
  decimal,
  text,
  timestamp,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  username: varchar('username', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const products = mysqlTable('products', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 150 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  stock: int('stock').notNull().default(0),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
});
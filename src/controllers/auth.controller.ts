import { Request, Response } from "express";
import { supabase } from "../config/supabase";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../validations/auth.validation";

export class AuthController {
  register = async (req: Request, res: Response) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const { username, email, password } = validatedData;

      const { data: existingUser } = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .single();

      if (existingUser) {
        return res.status(409).json({ success: false, message: "Email sudah terdaftar" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const { data: newUser, error } = await supabase
        .from("users")
        .insert([{ username, email, password: hashedPassword }])
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        message: "Registrasi berhasil",
        data: {
          user: { id: newUser.id, username: newUser.username, email: newUser.email }
        }
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ success: false, message: error.errors[0].message });
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;

      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error || !user) {
        return res.status(404).json({ success: false, message: "Email atau password salah" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Email atau password salah" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        success: true,
        message: "Login berhasil",
        data: {
          token,
          user: { id: user.id, username: user.username, email: user.email }
        }
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ success: false, message: error.errors[0].message });
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default new AuthController();

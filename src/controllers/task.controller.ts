import { Request, Response } from "express";
import { supabase } from "../config/supabase";
import { uploadToCloudinary } from "../services/cloudinary.service";
import { CreateTaskBody, UpdateTaskBody } from "../types/task.types";

// GET /tasks
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil semua data tasks",
      data,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /tasks/:id
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single(); // .single() memastikan hanya 1 data yang diambil

    if (error || !data) {
      return res.status(404).json({ success: false, message: "Task tidak ditemukan" });
    }

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /tasks
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status } = req.body as CreateTaskBody;

    // Validasi
    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title dan description wajib diisi" });
    }

    const finalStatus = status || "pending";
    if (finalStatus !== "pending" && finalStatus !== "completed") {
      return res.status(400).json({ success: false, message: "Status hanya boleh 'pending' atau 'completed'" });
    }

    // Handle Upload Image jika ada
    let imageUrl: string | undefined;
    let imagePublicId: string | undefined;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    // Insert ke Supabase
    const { data, error } = await supabase
      .from("tasks")
      .insert([{ title, description, status: finalStatus, image_url: imageUrl, image_public_id: imagePublicId }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Task berhasil ditambahkan",
      data,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /tasks/:id
export const updateTask = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, description, status } = req.body as UpdateTaskBody;

    // Cek data lama dulu (untuk validasi & handle gambar lama)
    const { data: existingTask, error: fetchError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingTask) {
      return res.status(404).json({ success: false, message: "Task tidak ditemukan" });
    }

    // Validasi Status
    if (status && status !== "pending" && status !== "completed") {
      return res.status(400).json({ success: false, message: "Status hanya boleh 'pending' atau 'completed'" });
    }

    // Handle Upload Image baru jika ada
    let imageUrl = existingTask.image_url;
    let imagePublicId = existingTask.image_public_id;

    if (req.file) {
      // Upload gambar baru
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
      
      // (Opsional) Hapus gambar lama di Cloudinary jika ada
      // if (existingTask.image_public_id) {
      //   await cloudinary.uploader.destroy(existingTask.image_public_id);
      // }
    }

    // Update ke Supabase
    const { data, error } = await supabase
      .from("tasks")
      .update({
        title: title || existingTask.title,
        description: description || existingTask.description,
        status: status || existingTask.status,
        image_url: imageUrl,
        image_public_id: imagePublicId,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Task berhasil diperbarui",
      data,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /tasks/:id
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: "Task tidak ditemukan" });
    }

    res.status(200).json({
      success: true,
      message: "Task berhasil dihapus",
      data,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { supabase } from "../config/supabase";
import { uploadToCloudinary } from "../services/cloudinary.service";
import cloudinary from "../config/cloudinary";
import { CreateMaintenanceBody } from "../types/maintenance.types";

export class MaintenanceController {
  getAllMaintenances = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const { data, error } = await supabase
        .from("maintenances")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  getMaintenanceById = async (req: AuthRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      const userId = req.user?.id;

      const { data, error } = await supabase
        .from("maintenances")
        .select("*")
        .eq("id", id)
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
      }

      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  createMaintenance = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const { item_name, service_type, cost, last_service_date, next_service_date, status } = req.body as CreateMaintenanceBody;

      if (!item_name || !service_type || !cost || !last_service_date || !next_service_date) {
        return res.status(400).json({ success: false, message: "Semua kolom wajib diisi" });
      }

      let imageUrl: string | undefined;
      let imagePublicId: string | undefined;

      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
      }

      const { data, error } = await supabase
        .from("maintenances")
        .insert([{
          user_id: userId,
          item_name,
          service_type,
          cost: Number(cost),
          last_service_date,
          next_service_date,
          status: status || "scheduled",
          image_url: imageUrl,
          image_public_id: imagePublicId
        }])
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({ success: true, message: "Catatan servis berhasil ditambahkan", data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  updateMaintenance = async (req: AuthRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      const userId = req.user?.id;
      const { item_name, service_type, cost, last_service_date, next_service_date, status } = req.body;

      const { data: existingData, error: fetchError } = await supabase
        .from("maintenances")
        .select("*")
        .eq("id", id)
        .eq("user_id", userId)
        .single();

      if (fetchError || !existingData) {
        return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
      }

      let imageUrl = existingData.image_url;
      let imagePublicId = existingData.image_public_id;

      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;

        if (existingData.image_public_id) {
          await cloudinary.uploader.destroy(existingData.image_public_id);
        }
      }

      const { data, error } = await supabase
        .from("maintenances")
        .update({
          item_name: item_name || existingData.item_name,
          service_type: service_type || existingData.service_type,
          cost: cost ? Number(cost) : existingData.cost,
          last_service_date: last_service_date || existingData.last_service_date,
          next_service_date: next_service_date || existingData.next_service_date,
          status: status || existingData.status,
          image_url: imageUrl,
          image_public_id: imagePublicId
        })
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ success: true, message: "Catatan servis berhasil diperbarui", data });
    } catch (error: any) {
return res.status(500).json({ success: false, message: error.message });
}
};
deleteMaintenance = async (req: AuthRequest, res: Response) => {
try {
const id = Number(req.params.id);
const userId = req.user?.id;
const { data, error } = await supabase
.from("maintenances")
.delete()
.eq("id", id)
.eq("user_id", userId)
.select()
.single();
if (error || !data) {
return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
}
if (data.image_public_id) {
await cloudinary.uploader.destroy(data.image_public_id);
}
return res.status(200).json({ success: true, message: "Catatan servis berhasil dihapus" });
} catch (error: any) {
return res.status(500).json({ success: false, message: error.message });
}
};
}
export default new MaintenanceController();

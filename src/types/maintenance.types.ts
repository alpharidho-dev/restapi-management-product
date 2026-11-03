export type MaintenanceStatus = "scheduled" | "done";

export interface User {
  id: string;
  email: string;
  username: string;
  created_at?: string;
}

export interface Maintenance {
  id: number;
  user_id: string;
  item_name: string;
  service_type: string;
  cost: number;
  last_service_date: string;
  next_service_date: string;
  status: MaintenanceStatus;
  image_url?: string;
  image_public_id?: string;
  created_at?: string;
}

export interface CreateMaintenanceBody {
  item_name: string;
  service_type: string;
  cost: number;
  last_service_date: string;
  next_service_date: string;
  status?: MaintenanceStatus;
}

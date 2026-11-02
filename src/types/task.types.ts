export type TaskStatus = "pending" | "completed";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  image_url?: string;
  image_public_id?: string;
  created_at?: string;
}

export interface CreateTaskBody {
  title: string;
  description: string;
  status?: TaskStatus;
}

export interface UpdateTaskBody {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
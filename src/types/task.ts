export type Priority = "low" | "medium" | "high" | "critical";
export type TaskStatus = "pending" | "completed" | "overdue";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: Date;
  createdAt: Date;
  completedAt?: Date;
  category?: string;
  tags?: string[];
}

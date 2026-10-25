import api from "./client";
import type { Task, TaskInput, TaskStatus } from "../types/task";

export const getTasks = (status?: TaskStatus) =>
  api
    .get<Task[]>("/tasks", { params: status ? { status } : {} })
    .then((r) => r.data);

export const createTask = (data: TaskInput) =>
  api.post<Task>("/tasks", data).then((r) => r.data);

export const updateTask = (id: number, data: TaskInput) =>
  api.patch<Task>(`/tasks/${id}`, data).then((r) => r.data);

export const deleteTask = (id: number) =>
  api.delete(`/tasks/${id}`).then((r) => r.data);

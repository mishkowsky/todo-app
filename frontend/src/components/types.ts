export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  completed: boolean;
  created_at: string;
  completed_at: string | null;
}

export interface TaskFormData {
  title: string;
  description: string;
  deadline: string | null;
}

export interface TaskFilterStatus {
  all: boolean;
  active: boolean;
  completed: boolean;
  expired: boolean;
}

export const API_BASE_URL = "http://192.168.10.115:8000/api";

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
};

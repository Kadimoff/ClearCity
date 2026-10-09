import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Accept': 'application/json',
  },
});

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  department_name?: string;
}

export interface Department {
  id: number;
  name: string;
  email: string;
  phone?: string;
  is_active: boolean;
}

export interface StatusHistory {
  id: number;
  old_status: string;
  new_status: string;
  status_display: string;
  changed_by: string;
  comment: string;
  changed_at: string;
}

export interface AIClassification {
  id: number;
  category_predicted: string;
  confidence: number;
  raw_response: any;
  created_at: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  photo_url?: string;
  latitude?: number;
  longitude?: number;
  address: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'resolved' | 'rejected';
  status_display: string;
  priority: 'low' | 'medium' | 'high';
  priority_display: string;
  citizen_email?: string;
  photo_source?: string;
  has_exif_location?: boolean;
  camera_model?: string;
  citizen_token: string;
  dept_token: string;
  category_detail?: Category;
  department_detail?: Department;
  status_history?: StatusHistory[];
  ai_classification?: AIClassification;
  created_at: string;
  updated_at: string;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await api.get('/categories/');
  return res.data;
}

export async function fetchDepartments(): Promise<Department[]> {
  const res = await api.get('/departments/');
  return res.data;
}

export async function submitReport(formData: FormData): Promise<Report> {
  const res = await api.post('/reports/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}

export async function fetchReportByToken(token: string): Promise<Report> {
  const res = await api.get(`/reports/track/${token}/`);
  return res.data;
}

export async function updateReportStatus(deptToken: string, status: string, comment: string): Promise<Report> {
  const res = await api.post(`/reports/update-status/${deptToken}/`, { status, comment });
  return res.data;
}

export async function classifyPhoto(file: File) {
  const formData = new FormData();
  formData.append('photo', file);
  const res = await api.post('/classify-photo/', formData);
  return res.data;
}

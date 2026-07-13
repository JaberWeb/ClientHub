import api from "./api";

export interface CreateProjectInput {
  ownerId: string;
  clientId: string;
  name: string;
  description: string;
  projectValue: number;
  projectType?: string;
  status?: string;
  dueDate?: string;
  website?: string;
  mediaUrl?: string;
  targetAudience?: string;
  credentials?: string;
}

export interface Project extends CreateProjectInput {
  _id: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    _id: string;
    companyName: string;
    contactPerson: string;
    email: string;
  };
}

export interface GetProjectsResult {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function addProject(data: CreateProjectInput): Promise<Project> {
  const res = await api.post<{ message: string; project: Project }>("/api/projects", data);
  return res.data.project;
}

export async function updateProjectStatus(id: string, status: string): Promise<Project> {
  const res = await api.patch<Project>(`/api/projects/${id}/status`, { status });
  return res.data;
}

export async function getProjects(params: {
  ownerId: string;
  search?: string;
  status?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<GetProjectsResult> {
  const res = await api.get<GetProjectsResult>("/api/projects", { params });
  return res.data;
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/api/projects/${id}`);
}

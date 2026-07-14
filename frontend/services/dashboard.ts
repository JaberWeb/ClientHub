import api from "./api";
import type { Invoice } from "./invoice";

export interface DashboardStats {
  totalClients: number;
  totalProjects: number;
  activeProjects: number;
  totalRevenue: number;
  overdueInvoices: number;
  recentInvoices: Invoice[];
}

export async function getDashboardStats(ownerId: string): Promise<DashboardStats> {
  const res = await api.get<DashboardStats>("/api/dashboard/stats", {
    params: { ownerId },
  });
  return res.data;
}

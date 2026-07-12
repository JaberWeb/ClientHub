import api from "./api";

export interface CompanySettings {
  ownerId: string;
  companyName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  logoUrl: string;
  country: string;
}

export async function getSettings(ownerId: string): Promise<CompanySettings | null> {
  const res = await api.get<CompanySettings | null>("/api/settings", { params: { ownerId } });
  return res.data;
}

export async function saveSettings(data: CompanySettings): Promise<CompanySettings> {
  const res = await api.post<CompanySettings>("/api/settings", data);
  return res.data;
}

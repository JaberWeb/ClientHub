import api from "./api";

export interface CreateClientInput {
  ownerId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  notes?: string;
}

export interface Client extends CreateClientInput {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetClientsResult {
  clients: Client[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface getSingleClientResult {
  client: Client;
}
export async function addClient(data: CreateClientInput): Promise<Client> {
  const res = await api.post<{ message: string; client: Client }>("/api/clients", data);
  return res.data.client;
}

export async function getClients(params: {
  ownerId: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<GetClientsResult> {
  const res = await api.get<GetClientsResult>("/api/clients", { params });
  return res.data;
}
export async function getClientById(id: string): Promise<getSingleClientResult | null> {
    const res = await api.get<getSingleClientResult>(`/api/clients/${id}`);
    return res.data;
}
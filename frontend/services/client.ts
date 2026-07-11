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

export async function addClient(data: CreateClientInput): Promise<Client> {
  const res = await api.post<{ message: string; client: Client }>("/api/clients", data);
  return res.data.client;
}

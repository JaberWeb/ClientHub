import api from "./api";

export interface CreateInvoiceInput {
  ownerId: string;
  clientId: string;
  projectId: string;
  amount: number;
  status?: string;
  issueDate?: string;
  dueDate?: string;
  notes?: string;
}

export interface Invoice extends CreateInvoiceInput {
  _id: string;
  invoiceNumber: string;
  createdAt: string;
  updatedAt: string;
  project?: {
    _id: string;
    name: string;
    description: string;
    projectValue: number;
  };
  client?: {
    _id: string;
    companyName: string;
    contactPerson: string;
    email: string;
  };
}

export interface GetInvoicesResult {
  invoices: Invoice[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function createInvoice(data: CreateInvoiceInput): Promise<Invoice> {
  const res = await api.post<{ message: string; invoice: Invoice }>("/api/invoices", data);
  return res.data.invoice;
}

export async function getInvoices(params: {
  ownerId: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<GetInvoicesResult> {
  const res = await api.get<GetInvoicesResult>("/api/invoices", { params });
  return res.data;
}

export async function getInvoiceById(id: string): Promise<Invoice> {
  const res = await api.get<Invoice>(`/api/invoices/${id}`);
  return res.data;
}

export async function updateInvoiceStatus(id: string, status: string): Promise<Invoice> {
  const res = await api.patch<Invoice>(`/api/invoices/${id}/status`, { status });
  return res.data;
}

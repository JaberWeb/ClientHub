import { ObjectId } from "mongodb";

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
  _id: ObjectId;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

//projects
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
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

//invoices
export interface CreateInvoiceInput {
  ownerId: string;
  clientId: string;
  projectId: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  issueDate: string;
  dueDate: string;
  notes?: string;
}

export interface Invoice extends CreateInvoiceInput {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanySettings {
  ownerId: string;
  companyName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  logoUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

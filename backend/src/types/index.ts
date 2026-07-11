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

import api from "./api";

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactMessage(data: ContactInput): Promise<void> {
  await api.post("/api/contact", data);
}

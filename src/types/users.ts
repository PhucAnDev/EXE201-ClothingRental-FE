// src/types/users.ts
export interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: "customer" | "admin";
}

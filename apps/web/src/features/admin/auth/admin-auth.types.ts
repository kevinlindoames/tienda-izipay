export type AdminRole = "OWNER" | "ADMIN";

export interface CurrentAdmin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
}

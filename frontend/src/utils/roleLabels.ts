import type { Role } from "../types/auth";

export function formatRole(role: Role | undefined): string {
  if (role === "ADMIN") return "Admin real";
  if (role === "DEMOADMIN") return "Demo Admin";
  if (role === "TECHNICIAN") return "Tecnico";

  return "Usuario";
}

export function isDemoAdmin(role: Role | undefined): boolean {
  return role === "DEMOADMIN";
}

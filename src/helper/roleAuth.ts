import { Role } from "discord.js";

export async function checkForAccessByRoles(user: any, roles: Array<string>) {
  let hasRole: boolean = false;
  roles.forEach((findrole) => {
    if (user.roles.cache.some((role: Role) => role.name === findrole)) {
      hasRole = true;
    }
  });
  return hasRole;
}

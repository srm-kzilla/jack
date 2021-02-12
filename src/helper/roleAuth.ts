import { GuildMember } from "discord.js";

/**
 * Check for access for commands
 *
 * @param {GuildMember | null} user
 * @param {Array<string>} roles
 */
export async function checkForAccessByRoles(
  user: GuildMember | null,
  roles: Array<string>
) {
  let hasRole: boolean = false;
  roles.forEach((findrole) => {
    if (user && user.roles.cache.has(findrole)) {
      hasRole = true;
    }
  });
  return hasRole;
}

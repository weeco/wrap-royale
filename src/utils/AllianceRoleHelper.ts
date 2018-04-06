import * as fs from 'fs';
import * as path from 'path';
import { IText, LocaleHelper, Locales } from './LocaleHelper';

/**
 * Helper class for retrieving badge details by badgeId
 */
export namespace AllianceRoleHelper {
  const roleById: Map<number, IRoleDetails> = new Map();
  const roleByName: Map<string, IRoleDetails> = new Map();
  const roleByApiName: Map<string, IRoleDetails> = new Map();
  const rolesJsonPath: string = path.join(__dirname, '..', '..', 'assets', 'alliance_roles.json');
  const roles: IAllianceRoleJson[] = <IAllianceRoleJson[]>JSON.parse(fs.readFileSync(rolesJsonPath, 'utf8'));

  for (const role of roles) {
    const roleDetails: IRoleDetails = {
      id: role.scid,
      name: LocaleHelper.getTextById(role.TID),
      apiName: role.apiName,
      level: role.level,
      TID: role.TID,
      canInvite: role.canInvite ? role.canInvite : false,
      canSendMail: role.canSendMail ? role.canSendMail : false,
      canChangeAllianceSettings: role.canChangeAllianceSettings ? role.canChangeAllianceSettings : false,
      canAcceptJoinRequest: role.canAcceptJoinRequest ? role.canAcceptJoinRequest : false,
      canKick: role.canKick ? role.canKick : false,
      canBePromotedToLeader: role.canBePromotedToLeader ? role.canBePromotedToLeader : false,
      canPromoteToOwnLevel: role.canPromoteToOwnLevel ? role.canPromoteToOwnLevel : false
    };

    roleById.set(role.scid, roleDetails);
    roleByApiName.set(role.apiName, roleDetails);

    // Set role details for all different locales
    const keys: (keyof typeof Locales)[] = <(keyof typeof Locales)[]>Object.keys(Locales);
    for (const key of keys) {
      const locale: string = Locales[key];
      if (roleDetails.name != null) {
        roleByName.set(`${locale}-${roleDetails.name[locale]}`, roleDetails);
      }
    }
  }

  /**
   * Returns role details for a given role id.
   * @param roleId The role's id (we use Supercell's role ids - e.g. 59000004)
   */
  export function getRoleById(roleId: number): IRoleDetails {
    return roleById.get(roleId);
  }

  /**
   * Returns role details by role name.
   * @param roleName The role's name.
   * @param locale In what language the given name is.
   */
  export function getRoleByName(roleName: string, locale: Locales = Locales.En): IRoleDetails {
    return roleByName.get(`${locale}-${roleName}`);
  }

  /**
   * Returns role details by role name.
   * @param roleName The role's name.
   */
  export function getRoleByApiName(roleName: string): IRoleDetails {
    return roleByApiName.get(`${roleName}`);
  }
}

export interface IRoleDetails {
  /**
   * Supercell's role ids (59000000 - 59000004)
   */
  id: number;
  name: IText;
  apiName: string;
  level?: number;
  TID: string;
  canInvite: boolean;
  canSendMail: boolean;
  canChangeAllianceSettings?: boolean;
  canAcceptJoinRequest?: boolean;
  canKick?: boolean;
  canBePromotedToLeader?: boolean;
  canPromoteToOwnLevel?: boolean;
}

interface IAllianceRoleJson {
  name: string;
  scid: number;
  apiName: string;
  level?: number;
  TID: string;
  canInvite?: boolean;
  canSendMail?: boolean;
  canChangeAllianceSettings?: boolean;
  canAcceptJoinRequest?: boolean;
  canKick?: boolean;
  canBePromotedToLeader?: boolean;
  canPromoteToOwnLevel?: boolean;
}

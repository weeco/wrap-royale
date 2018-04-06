import { AccessType } from '../../common/types';
import { classToPlain, Exclude, Expose, plainToClass, Transform, Type } from '../../utils/class-transformer/index';
import { HashtagHelper } from '../../utils/HashtagHelper';
import { HiLo, IHiLo } from '../common/HiLo';
import { ILocation, Location } from '../common/Location';
import { ClanMember, IClanMember } from './ClanMember';

export enum ClanChestStatus {
  /**
   * Clan chest is inactive (weekdays)
   */
  Inactive = 'inactive',
  /**
   * Clan chest is active (weekend)
   */
  Active = 'active',
  /**
   * Clan chest has been completed
   */
  Completed = 'completed'
}

/**
 * A Clash Royale player profile
 */
@Exclude()
export class ClanProfile {
  @Transform((tag: string) => HashtagHelper.normalizeHashtag(tag))
  @Expose()
  public tag: string;

  @Expose()
  public get clanId(): HiLo {
    const hiLo: IHiLo = HashtagHelper.getHiLoFromHashtag(this.tag);

    return new HiLo(hiLo.high, hiLo.low);
  }

  @Expose() public name: string;

  @Expose()
  public get nameNormalized(): string {
    return this.name.normalize('NFD').toLowerCase();
  }

  @Expose({ name: 'type' })
  public accessType: AccessType;

  @Expose() public description: string;

  @Expose() public badgeId: number;

  @Expose() public clanScore: number;

  @Type(() => Location)
  @Expose()
  public location: Location;

  @Expose() public requiredTrophies: number;

  @Expose() public donationsPerWeek: number;

  @Expose() public clanChestStatus: ClanChestStatus;

  @Expose() public clanChestPoints: number;

  @Expose() public clanChestLevel: number;

  @Expose() public clanChestMaxLevel: number;

  @Expose({ name: 'members' })
  public membersCount: number;

  @Type(() => ClanMember)
  @Expose()
  public memberList: ClanMember[];

  private memberListByDonations: ClanMember[];
  private memberListByTrophies: ClanMember[];
  private memberListByClanChestPoints: ClanMember[];

  public static FROM_JSON(clanProfileJson: {}): ClanProfile {
    return plainToClass(ClanProfile, clanProfileJson);
  }

  public toJson(): IClanProfile {
    return <IClanProfile>classToPlain(this);
  }

  /**
   * Returns the top donators of a clan.
   * @param limit The number of top donators to retrieve
   */
  public getTopMembersByDonations(limit: number = 5): ClanMember[] {
    if (this.memberListByDonations == null) {
      this.memberListByDonations = this.memberList.sort((a: ClanMember, b: ClanMember) => b.donations - a.donations);
    }

    return this.memberListByDonations.slice(0, limit);
  }

  /**
   * Returns the top players (by trophies) of a clan.
   * @param limit The number of top players to retrieve
   */
  public getTopMembersByTrophies(limit: number = 5): ClanMember[] {
    if (this.memberListByTrophies == null) {
      this.memberListByTrophies = this.memberList.sort((a: ClanMember, b: ClanMember) => b.trophies - a.trophies);
    }

    return this.memberListByTrophies.slice(0, limit);
  }

  /**
   * Returns the top players by contributed chest points of a clan.
   * @param limit The number of top contributors to retrieve
   */
  public getTopMembersByChestPoints(limit: number = 5): ClanMember[] {
    if (this.memberListByClanChestPoints == null) {
      const chestParticipants: ClanMember[] = this.memberList.filter((x: ClanMember) => x.clanChestPoints != null);
      this.memberListByClanChestPoints = chestParticipants.sort(
        (a: ClanMember, b: ClanMember) => b.clanChestPoints - a.clanChestPoints
      );
    }

    return this.memberListByClanChestPoints.slice(0, limit);
  }
}

/**
 * Interface for the serialized clanprofile
 */
export interface IClanProfile {
  tag: string;
  clanId: IHiLo;
  name: string;
  nameNormalized: string;
  accessType: AccessType; // tslint:disable-line
  description: string;
  badgeId: number;
  clanScore: number;
  location: ILocation;
  requiredTrophies: number;
  donationsPerWeek: number;
  clanChestStatus: string;
  clanChestPoints: number;
  clanChestLevel: number;
  clanChestMaxLevel: number;
  members: number;
  memberList: IClanMember[];
}

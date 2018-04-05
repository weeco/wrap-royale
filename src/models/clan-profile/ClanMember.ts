import { Role } from '../../common/types';
import { classToPlain, Exclude, Expose, plainToClass, Transform, Type } from '../../utils/class-transformer/index';
import { HashtagHelper } from '../../utils/HashtagHelper';
import { Arena, IArena } from '../common/Arena';
import { HiLo, IHiLo } from '../common/HiLo';

/**
 * A Clash Royale player profile
 */
@Exclude()
export class ClanMember {
  @Transform((tag: string) => HashtagHelper.normalizeHashtag(tag))
  @Expose()
  public tag: string;

  @Expose()
  public get accountId(): HiLo {
    const hiLo: IHiLo = HashtagHelper.getHiLoFromHashtag(this.tag);

    return new HiLo(hiLo.high, hiLo.low);
  }

  @Expose()
  public name: string;

  @Expose()
  public role: Role;

  @Expose()
  public expLevel: number;

  @Expose()
  public trophies: number;

  @Type(() => Arena)
  @Expose()
  public arena: Arena;

  @Expose()
  public clanRank: number;

  @Expose()
  public previousClanRank: number;

  @Expose()
  public donations: number;

  @Expose()
  public donationsReceived: number;

  @Expose()
  public clanChestPoints?: number;

  public static FROM_JSON(clanMemberJson: {}): ClanMember {
    return plainToClass(ClanMember, clanMemberJson);
  }

  public toJson(): IClanMember {
    return <IClanMember>classToPlain(this);
  }
}

/**
 * Interface for a serialized ClanMember
 */
export interface IClanMember {
  tag: string;
  accountId: IHiLo;
  name: string;
  role: Role;
  expLevel: number;
  trophies: number;
  arena: IArena;
  clanrank: number;
  previousClanRank: number;
  donations: number;
  donationsReceived: number;
  clanChestPoints: number;
}

import { classToPlain, Exclude, Expose, plainToClass } from 'class-transformer';
import { ArenaHelper, IArenaDetails } from '../../utils/ArenaHelper';

/**
 * Arena model
 */
@Exclude()
export class Arena {
  /**
   * Supercell's arena id (54000000 - 54000020)
   */
  @Expose()
  public id: number;

  public static FROM_JSON(arenaJson: {}): Arena {
    return plainToClass(Arena, arenaJson);
  }

  public toJson(): IArena {
    return <IArena>classToPlain(this);
  }

  public getArenaDetails(): IArenaDetails {
    return ArenaHelper.getArenaById(this.id);
  }
}

/**
 * Interface for a serialized Arena
 */
export interface IArena {
  id: number;
}

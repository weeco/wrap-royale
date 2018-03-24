import { classToPlain, Exclude, Expose, plainToClass } from '../../utils/class-transformer/index';

/**
 * The game mode property in battlelogs (e. g. 72000010 - which is the challenge game mode with deckselection)
 */
@Exclude()
export class GameMode {
  @Expose()
  public id: number = void 0;

  public static FROM_JSON(gameModeJson: {}): GameMode {
    return plainToClass(GameMode, gameModeJson);
  }

  public toJson(): IGameMode {
    return <IGameMode>classToPlain(this);
  }
}

/**
 * A serialized GameMode
 */
export interface IGameMode {
  id: number;
}

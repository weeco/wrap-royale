import { classToPlain, Exclude, Expose, plainToClass } from '../../utils/class-transformer/index';

/**
 * The challengeId property in battlelogs (e. g. 65000000 - which is the common grand challenge)
 */
@Exclude()
export class Challenge {
  @Expose() public id: number;

  public static FROM_JSON(challengeModeJson: {}): Challenge {
    return plainToClass(Challenge, challengeModeJson);
  }

  public toJson(): IChallenge {
    return <IChallenge>classToPlain(this);
  }
}

/**
 * A serialized ChallengeMode
 */
export interface IChallenge {
  id: number;
}

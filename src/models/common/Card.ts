import { classToPlain, Exclude, Expose, plainToClass } from 'class-transformer';
import { CardHelper, ICardDetails } from '../../utils/CardHelper';

/**
 * The minimum class properties which can represent a card
 */
@Exclude()
export class BaseCard {
  @Expose()
  public id: number;

  public static FROM_JSON(baseCardJson: {}): BaseCard {
    return plainToClass(BaseCard, baseCardJson);
  }

  public toJson(): IBaseCard {
    return <IBaseCard>classToPlain(this);
  }

  /**
   * Receive all card details for this card
   */
  public getCardDetails(): ICardDetails {
    return CardHelper.getCardById(this.id);
  }
}

/**
 * A serialized BaseCard
 */
export interface IBaseCard {
  id: number;
}

/**
 * A Clashroyale card can currently only be identified with it's name
 */
@Exclude()
export class Card extends BaseCard {
  @Expose()
  public level: number;
}

/**
 * A serialized Card
 */
export interface ICard extends IBaseCard {
  level: number;
}

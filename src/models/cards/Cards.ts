import { classToPlain, Exclude, Expose, plainToClass, Type } from '../../utils/class-transformer/index';
import { BaseCard, IBaseCard } from '../common/Card';

/**
 * List of all available locations
 */
@Exclude()
export class Cards {
  @Expose()
  @Type(() => BaseCard)
  public items: BaseCard[];

  public static FROM_JSON(cardsJson: {}): Cards {
    return plainToClass(Cards, cardsJson);
  }

  public toJson(): ICards {
    return <ICards>classToPlain(this);
  }
}

/**
 * Serialized Cards
 */
export interface ICards {
  items: IBaseCard[];
}

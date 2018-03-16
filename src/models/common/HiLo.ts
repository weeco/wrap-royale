/**
 * The High and Low id which can be converted to a player tag
 */
export class HiLo {
  public high: number;
  public low: number;

  constructor(high: number, low: number) {
    this.high = high;
    this.low = low;
  }
}

/**
 * A serialized HiLo
 */
export interface IHiLo {
  high: number;
  low: number;
}

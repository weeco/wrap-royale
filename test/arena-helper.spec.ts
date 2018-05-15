/**
 * Test arena helper module
 */
import * as chai from 'chai';
import { ArenaHelper, IArenaDetails } from '../src/index';

const expect: Chai.ExpectStatic = chai.expect;
const exampleArenaIds: number[] = [54000001, 54000002, 54000020, 54000018, 54000024];

describe('Arena Helper', () => {
  it('should contain all object properties', () => {
    for (const id of exampleArenaIds) {
      const arena: IArenaDetails = ArenaHelper.getArenaById(id);
      expect(arena.id).to.be.a('number');
      expect(arena.arena).to.be.a('number');
      expect(arena.name).to.be.a('object');
      expect(arena.name.en).to.be.a('string');
      expect(arena.subtitle).to.be.a('object');
      expect(arena.subtitle.en).to.be.a('string');
      expect(arena.iconUrls).to.be.a('object');
      expect(arena.requestSize).to.be.a('number');
      expect(arena.maxDonationCountCommon).to.be.a('number');
      expect(arena.maxDonationCountEpic).to.be.a('number');
      expect(arena.maxDonationCountRare).to.be.a('number');
    }
  });

  it('should return a name for each predefined arena scid', () => {
    for (const id of exampleArenaIds) {
      const arenaName: string = ArenaHelper.getArenaById(id).name.en;
      expect(arenaName).to.be.a('string');
    }
  });

  it('should return an arena by number', () => {
    const arena: IArenaDetails = ArenaHelper.getArenaByNumber(11);
    expect(arena.name.en).to.equal('Arena 11');
  });
});

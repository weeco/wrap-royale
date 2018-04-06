/**
 * Test badge helper module
 */
import * as chai from 'chai';
import { BadgeHelper, IBadgeDetails } from '../index';

const expect: Chai.ExpectStatic = chai.expect;
const exampleBadgeIds: number[] = [16000000, 16000050, 16000179];

describe('Badge Helper', () => {
  it('should return a badge by id which contains all object properties', () => {
    for (const id of exampleBadgeIds) {
      const badge: IBadgeDetails = BadgeHelper.getBadgeById(id);
      expect(badge.id)
        .to.be.a('number')
        .to.be.at.least(16000000)
        .and.be.lessThan(17000000);
      expect(badge.iconUrls).to.be.a('object');
    }
  });
});

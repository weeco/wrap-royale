/**
 * Hashtag helper module
 */
import * as chai from 'chai';
import { HashtagHelper, IHiLo } from '../src/index';

const expect: Chai.ExpectStatic = chai.expect;

describe('Hashtag Helper', () => {
  it('should normalize a hashtag', () => {
    const invalidHashtag: string = '#2POOP';
    const normalizedTag: string = HashtagHelper.normalizeHashtag(invalidHashtag);
    expect(normalizedTag)
      .to.not.include('#')
      .and.to.not.include('O');
  });

  it('should reject invalid hashtags', () => {
    const invalidHashtags: string[] = ['2ABC', '2P', '2PPPPPPPPPPPPPP'];
    for (const tag of invalidHashtags) {
      expect(HashtagHelper.isValidHashtag(tag)).to.be.equal(
        false,
        `Hashtag ${tag} is invalid, but has been recognized as valid`
      );
    }
  });

  it('should resolve the hi and lo id from a hashtag', () => {
    const hashtag: string = '#VR80UJG';
    const hiLo: IHiLo = { high: 4, low: 401577 };
    const resolvedHiLo: IHiLo = HashtagHelper.getHiLoFromHashtag(hashtag);
    expect(resolvedHiLo.high).to.be.equal(hiLo.high);
    expect(resolvedHiLo.low).to.be.equal(hiLo.low);
  });

  it('should convert the hi and lo to a valid hashtag', () => {
    const hashtag: string = 'VR80UJG';
    const hiLo: IHiLo = { high: 4, low: 401577 };
    const convertedHashtag: string = HashtagHelper.getHashtagFromHiLo(hiLo.high, hiLo.low);
    expect(convertedHashtag).to.be.equal(hashtag);

    const hashtag2: string = '8ULQQ20P2';
    const hiLo2: IHiLo = { high: 1, low: 16663101 };
    const convertedHashtag2: string = HashtagHelper.getHashtagFromHiLo(hiLo2.high, hiLo2.low);
    expect(convertedHashtag2).to.be.equal(hashtag2);
  });
});

/**
 * Locale helper module
 */
import * as chai from 'chai';
import { IText, LocaleHelper } from '../index';

const expect: Chai.ExpectStatic = chai.expect;
const exampleTid: string = 'TID_LOADING';

describe('Locale Helper', () => {
  it('should return different translations for a given TID', () => {
    const loadingText: IText = LocaleHelper.getTextById(exampleTid);
    const english: string = loadingText.en;
    const chineese: string = loadingText.cn;
    expect(english).to.not.equal(chineese);
  });
});

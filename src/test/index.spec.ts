/**
 * Test main features
 */
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import {} from 'mocha';
import { BaseCard,
  ClanMember,
  CRApi,
  IApiOptions,
  ICardDetails,
  ICards,
  IChestDetails,
  IClanLeaderboard,
  IClanProfile,
  ILocation,
  IPlayerBattleLog,
  IPlayerLeaderboard,
  IPlayerProfile,
  PlayerProfileCard
} from '../index';
import { Cards } from '../models/cards/Cards';
import { ClanLeaderboard } from '../models/clan-leaderboard/ClanLeaderboard';
import { ClanProfile } from '../models/clan-profile/ClanProfile';
import { Location } from '../models/common/Location';
import { ILocations, Locations } from '../models/locations/Locations';
import { PlayerBattleLog } from '../models/player-battlelog/PlayerBattleLog';
import { PlayerLeaderboard } from '../models/player-leaderboard/PlayerLeaderboard';
import { PlayerProfile } from '../models/player-profile/PlayerProfile';
import { IUpcomingChests, UpcomingChests } from '../models/upcoming-chests/UpcomingChests';

dotenv.config();
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('CR Api', () => {
  let config: { apiToken: string; apiUrl: string };
  let api: CRApi;

  // Assign Token and Baseurl as variable from .env file
  before(() => {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      CR_API_TEST_TOKEN: Joi.string().required()
        .description('API Token is required for testing'),
      CR_API_TEST_BASEURL: Joi.string().required()
        .description('Base url is required for testing')
    }).unknown().required();
    const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
    if (error !== null) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    config = {
      apiToken: envVars.CR_API_TEST_TOKEN,
      apiUrl: envVars.CR_API_TEST_BASEURL
    };
    // Env variables don't match the env pattern in order to test instanation with missing env vars
    api = new CRApi(config.apiUrl, config.apiToken);
  });

  describe('Create Instance', () => {
    it('should return CRApi instance using constructor params', () => {
      const options: IApiOptions = { timeoutMS: 4000, validateTags: false };
      expect(new CRApi(config.apiUrl, config.apiToken, options)).to.be.an.instanceOf(CRApi);
    });
  });

  describe('API Endpoints', () => {
    describe('Cards', () => {
      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return information for all available Clash Royale cards', async () => {
        const cards: Cards = await api.cards();
        expect(cards).to.be.an.instanceOf(Cards);
        expect(cards.items).to.be.an('array');
        expect(cards.items.length).to.be.gte(81);
        expect(cards.items[0]).to.be.an.instanceOf(BaseCard);
        expect(cards.items[0].id).to.equal(26000000);
      }).timeout(7000);

      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return serialized cards', async () => {
        const cards: Cards = await api.cards();
        const json: ICards = cards.toJson();
        expect(json).to.be.a('object');
        expect(json).to.be.not.an.instanceOf(Cards);
        expect(json.items).to.be.an('array');
        expect(json.items.length).to.be.gte(81);
        expect(json.items[0].id).to.equal(26000000);
      }).timeout(7000);

      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return card ids for all available Clash Royale cards', async () => {
        const cards: Cards = await api.cards();
        for (const card of cards.items) {
          expect(card.id).to.be.a('number');
        }
      }).timeout(7000);
    });

    describe('Locations', () => {
      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return information for all available Clash Royale locations', async () => {
        const locations: Locations = await api.locations();
        expect(locations.items).to.be.an('array');
        expect(locations.items.length).to.be.greaterThan(259);
        expect(locations.countries).to.be.an('array');
        expect(locations.countries.length).to.be.gte(254);
        expect(locations.regions).to.be.an('array');
        expect(locations.regions.length).to.be.gte(7);
      }).timeout(7000);

      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return serialized locations', async () => {
        const locations: Locations = await api.locations();
        const json: ILocations = locations.toJson();
        expect(json).to.be.a('object');
        expect(json).to.be.not.an.instanceOf(Locations);
        expect(json.items).to.be.an('array');
        expect(json.items.length).to.be.gte(81);
      }).timeout(7000);
    });

    describe('Location by id', () => {
      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return location information for Gibraltar', async () => {
        const id: number = 57000096; // Gibraltar
        const location: Location = await api.locationById(id);
        expect(location.id).to.equal(57000096);
        expect(location.getLocationDetails().name).to.equal('Gibraltar');
      }).timeout(7000);

      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return a serialized location', async () => {
        const id: number = 57000096; // Gibraltar
        const location: Location = await api.locationById(id);
        const json: ILocation = location.toJson();
        expect(json).to.be.a('object');
        expect(json).to.be.not.an.instanceOf(Location);
        expect(json.id).to.equal(57000096);
      }).timeout(7000);
    });

    describe('Local player rankings', () => {
      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return a player leaderboard for Germany', async () => {
        const id: number = 57000094; // Germany
        const rankings: PlayerLeaderboard = await api.playerLeaderboard(id);
        expect(rankings.items).to.be.an('array');
        expect(rankings.fetchedAt).to.be.a('date');
        expect(rankings.items.length).to.be.equal(200);
      }).timeout(7000);

      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return a serialized player leaderboard for Germany', async () => {
        const id: number = 57000094; // Germany
        const rankings: PlayerLeaderboard = await api.playerLeaderboard(id);
        const json: IPlayerLeaderboard = rankings.toJson();
        expect(json).to.be.a('object');
        expect(json).to.be.not.an.instanceOf(PlayerLeaderboard);
        expect(json.items).to.be.an('array');
        expect(json.fetchedAt).to.be.a('date');
        expect(json.items.length).to.equal(200);
      }).timeout(7000);
    });

    describe('Local clan rankings', () => {
      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return a clan leaderboard for Germany', async () => {
        const id: number = 57000094; // Germany
        const rankings: ClanLeaderboard = await api.clanLeaderboard(id);
        expect(rankings.items).to.be.an('array');
        expect(rankings.fetchedAt).to.be.a('date');
        expect(rankings.items.length).to.be.equal(200);
      }).timeout(7000);

      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return a serialized clan leaderboard for Germany', async () => {
        const id: number = 57000094; // Germany
        const rankings: ClanLeaderboard = await api.clanLeaderboard(id);
        const json: IClanLeaderboard = rankings.toJson();
        expect(json).to.be.a('object');
        expect(json).to.be.not.an.instanceOf(ClanLeaderboard);
        expect(json.fetchedAt).to.be.a('date');
        expect(json.items).to.be.an('array');
        expect(json.items.length).to.equal(200);
      }).timeout(7000);
    });

    describe('Player profile', () => {
      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return a player profile', async () => {
        const profile: PlayerProfile = await api.playerProfile('2PPP');
        expect(profile.name).to.be.a('string');
        expect(profile.cards[0].id).to.be.a('number');
        expect(profile.expLevel).to.be.a('number');
      }).timeout(7000);

      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return all max upgradeable card levels for a player profile', async () => {
        const profile: PlayerProfile = await api.playerProfile('209CRCLU');
        profile.cards.forEach((card: PlayerProfileCard) => {
          const maxUpgradeableCardLevel: number = card.getMaxUpgradeableCardLevel();
          expect(maxUpgradeableCardLevel >= card.level);
          expect(maxUpgradeableCardLevel <= 13);
        });
      }).timeout(7000);

      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should deserialize a serialized profile', async () => {
        const profile: PlayerProfile = await api.playerProfile('2JP8UQGP');
        const json: IPlayerProfile = profile.toJson();
        const deserializedProfile: PlayerProfile = PlayerProfile.FROM_JSON(json);
        expect(deserializedProfile).to.be.an.instanceOf(PlayerProfile);
        expect(profile.name).to.be.equal('Sermorglum');
        expect(deserializedProfile.cards[0].id).to.be.a('number');
      }).timeout(7000);

      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return a serialized player profile', async () => {
        const profile: PlayerProfile = await api.playerProfile('2JP8UQGP');
        const json: IPlayerProfile = profile.toJson();
        expect(json).to.be.a('object');
        expect(json).to.be.not.an.instanceOf(PlayerProfile);
        expect(json.nameNormalized).to.equal('sermorglum');
        expect(json.cards[0].id).to.be.a('number');
      }).timeout(7000);

      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return a player\'s to be found cards', async () => {
        const profile: PlayerProfile = await api.playerProfile('2PP');
        const toBeFoundCards: ICardDetails[] = profile.getToBeFoundCards();
        expect(toBeFoundCards.length).to.be.gte(75);
      }).timeout(7000);

      it('should throw an exception because of an invalid tag', () => {
        const invalidTag: string = '2PA';
        expect(api.playerProfile(invalidTag)).be.rejectedWith(`Hashtag '${invalidTag}' appears to be invalid.`);
      });
    });

    describe('Player\'s upcoming chests', () => {
      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return a player\'s upcoming chests', async () => {
        const chests: UpcomingChests = await api.playersUpcomingChests('2UYLVUQY');
        expect(chests.regularChests.length).to.be.equal(9);
        expect(chests.specialChests.length).to.be.gte(1);
        const chestDetails: IChestDetails = chests.items[0].getChestDetails();
        expect(chestDetails.iconUrls.large).to.contain('https://');
      }).timeout(7000);

      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return the serialized player\'s upcoming chests', async () => {
        const chests: UpcomingChests = await api.playersUpcomingChests('YQULRC8Y');
        const json: IUpcomingChests = chests.toJson();
        expect(json).to.be.a('object');
        expect(json).to.be.not.an.instanceOf(UpcomingChests);
        expect(json.items).to.be.an('array');
      }).timeout(7000);

      it('should throw an exception because of an invalid tag', () => {
        const invalidTag: string = '2PA';
        expect(api.playersUpcomingChests(invalidTag)).be.rejectedWith(`Hashtag '${invalidTag}' appears to be invalid.`);
      });
    });

    describe('Player\'s battle logs', () => {
      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return a player\'s battle logs', async () => {
        const logs: PlayerBattleLog[] = await api.playersBattleLogs('YQULRC8Y');
        expect(logs).to.be.an('array');
        // Check if cards have a card id in all logs
        for (const log of logs) {
          // Check all cards from team property
          for (const participant of log.team) {
            for (const card of participant.cards) {
              expect(card.id).to.be.a('number');
            }
          }

          // Check all cards from opponent property
          for (const participant of log.opponent) {
            for (const card of participant.cards) {
              expect(card.id).to.be.a('number');
            }
          }
        }
      }).timeout(7000);

      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return the concatenated team deck card ids', async () => {
        const logs: PlayerBattleLog[] = await api.playersBattleLogs('YQULRC8Y');
        const teamDeck: string = logs[0].getTeamDeckString();
        expect(teamDeck).to.contain(',');
      }).timeout(7000);

      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return the serialized player\'s battle logs', async () => {
        const logs: PlayerBattleLog[] = await api.playersBattleLogs('YQULRC8Y');
        const json: IPlayerBattleLog[] = logs.map((x: PlayerBattleLog) => x.toJson());
        expect(json).to.be.an('array');
        // Check if cards have a card id in all logs
        for (const log of json) {
          // Check all cards from team property
          for (const participant of log.team) {
            for (const card of participant.cards) {
              expect(card.id).to.be.a('number');
            }
          }

          // Check all cards from opponent property
          for (const participant of log.opponent) {
            for (const card of participant.cards) {
              expect(card.id).to.be.a('number');
            }
          }
        }
      }).timeout(7000);

      it('should throw an exception because of an invalid tag', () => {
        const invalidTag: string = '2PA';
        expect(api.playersBattleLogs(invalidTag)).be.rejectedWith(`Hashtag '${invalidTag}' appears to be invalid.`);
      });
    });

    describe('Clan profile', () => {
      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return a clan profile', async () => {
        const profile: ClanProfile = await api.clanProfile('82V9V');
        expect(profile.name).to.be.a('string').which.equals('Munich Warriors');
        expect(profile.clanScore).to.be.a('number');
      }).timeout(7000);

      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return a clan\'s top donators', async () => {
        const profile: ClanProfile = await api.clanProfile('82V9V');
        const topDonators: ClanMember[] = profile.getTopMembersByDonations(5);
        expect(topDonators).to.be.an('array').with.length(5);
      }).timeout(7000);

      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return a clan\'s top players by trophies', async () => {
        const profile: ClanProfile = await api.clanProfile('82V9V');
        const topPlayers: ClanMember[] = profile.getTopMembersByTrophies(5);
        expect(topPlayers).to.be.an('array').with.length(5);
      }).timeout(7000);

      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return a clan\'s top players by contributed clan chest points', async () => {
        const profile: ClanProfile = await api.clanProfile('82V9V');
        const topContributors: ClanMember[] = profile.getTopMembersByChestPoints(5);
        expect(topContributors).to.be.an('array').with.length(5);
      }).timeout(7000);

      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return a clan\'s country code', async () => {
        const profile: ClanProfile = await api.clanProfile('2PPP');
        expect(profile.location.getLocationDetails().countryCode).to.equal('SE');
      }).timeout(7000);

      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return a serialized clan profile', async () => {
        const profile: ClanProfile = await api.clanProfile('2PPP');
        const json: IClanProfile = profile.toJson();
        expect(json).to.be.a('object');
        expect(json).to.be.not.an.instanceOf(ClanProfile);
      }).timeout(7000);

      // tslint:disable-next-line:mocha-no-side-effect-code
      it('should return a clan profile with to be normalized tag', async () => {
        const profile: ClanProfile = await api.clanProfile('#2pp');
        expect(profile.name).to.be.a('string');
        expect(profile.clanScore).to.be.a('number');
      }).timeout(7000);

      it('should throw an exception because of an invalid tag', () => {
        const invalidTag: string = '2PA';
        expect(api.clanProfile(invalidTag)).be.rejectedWith(`Hashtag '${invalidTag}' appears to be invalid.`);
      });
    });
  });
});

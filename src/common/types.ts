/**
 * It's types (e. g. enums) + constants
 */

export enum BattleType {
  PvP = 'PvP',
  PvE = 'PvE',
  Tournament = 'tournament',
  Friendly = 'friendly',
  ClanFriendly = 'clanMate',
  Challenge = 'challenge',
  TwoVsTwo = '2v2',
  ClanMateTwoVsTwo = 'clanMate2v2',
  ChallengeTwoVsTwo = 'challenge2v2',
  TouchdownTwoVsTwoDraftpractice = 'touchdown2v2DraftPractice',
  TouchdownTwoVsTwoDraft = 'touchdown2v2Draft',
  Unknown = 'unknown'
}

/**
 * The URL friendly verison of BattleType
 */
export enum BattleTypeFriendly {
  PvP = 'pvp',
  PvE = 'pve',
  Tournament = 'tournament',
  Friendly = 'friendly',
  ClanFriendly = 'clan-mate',
  Challenge = 'challenge',
  TwoVsTwo = '2v2',
  ClanMateTwoVsTwo = 'clan-mate-2v2',
  ChallengeTwoVsTwo = 'challenge-2v2',
  TouchdownTwoVsTwoDraftpractice = 'touchdown-2v2-draft-practice',
  TouchdownTwoVsTwoDraft = 'touchdown-2v2-draft',
  Unknown = 'unknown'
}

/**
 * Resolve the actual BattleType value from a BattleTypeFriendly value using this enum.
 * (e. g. BattleTypeFriendlyReversed['clan-mate-2v2'] resolves to 'clanMate2v2')
 *
 * Additional string enum is needed as they can't be reverse mapped to get the original enum member name.
 */
export enum BattleTypeFriendlyReversed {
  'pvp' = 'PvP',
  'pve' = 'PvE',
  'tournament' = 'tournament',
  'friendly' = 'friendly',
  'clan-mate' = 'clanMate',
  'challenge' = 'challenge',
  '2v2' = '2v2',
  'clan-mate-2v2' = 'clanMate2v2',
  'challenge-2v2' = 'challenge2v2',
  'touchdown-2v2-draft-practice' = 'touchdown2v2DraftPractice',
  'touchdown-2v2-draft' = 'touchdown2v2Draft',
  'unknown' = 'unknown'
}

/**
 * The user friendly version of battle types
 */
export enum BattleTypeUserFriendly {
  PvP = 'Arena',
  PvE = 'Co-Op',
  Tournament = 'Tournament',
  Friendly = 'Friendly',
  ClanFriendly = 'Clan Friendly',
  Challenge = 'Challenge',
  TwoVsTwo = '2vs2',
  ClanMateTwoVsTwo = 'Clan Friendly 2vs2',
  ChallengeTwoVsTwo = 'Challenge 2vs2',
  TouchdownTwoVsTwoDraftpractice = 'Touchdown 2vs2 Draft Practice',
  TouchdownTwoVsTwoDraft = 'Touchdown 2vs2 Draft',
  Unknown = 'Unknown'
}

export enum ChallengeMode {
  Grand = 65000000,
  Classic = 65000001,
  KingsCup = 65000002,
  DoubleElixir = 65000003,
  BlindDeck = 65000004,
  DraftMode = 65000005,
  ThreeBridges = 65000006,
  Hero = 65000007,
  ElectroWizard = 65000008,
  BattleRamClassic = 65000010,
  BattleRamGrand = 65000011,
  DraftModeInsane = 65000012,
  Team = 65000013,
  RetroRoyale = 65000014,
  TeamVsEnemy = 65000015
}

export enum Deckselection {
  /**
   * This is the default, i.e. the player's current selected deck
   */
  Collection = 'collection',
  /**
   * The player starts the battle with the draft, selecting from 2 cards in pairs
   */
  Draft = 'draft',
  /**
   * The deck is predefined for the player
   */
  Predefined = 'predefined',
  /**
   * The player chooses a deck specifically for a challenge event
   */
  EventDeck = 'eventDeck',
  Pick = 'pick'
}

/**
 * Cards
 */
export enum Rarity {
  Common = 'Common',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary',
  Hero = 'Hero'
}

/**
 * Clans
 */
export enum Role {
  Member = 'member',
  Elder = 'elder',
  CoLeader = 'coLeader',
  Leader = 'leader'
}

export enum AccessType {
  InviteOnly = 'inviteOnly',
  Closed = 'closed',
  Open = 'open'
}

/**
 * Locations
 */
export enum RankingType {
  Clans = 'clans',
  Players = 'players'
}

/**
 * Game Types
 */
export const gameTypes: IGameTypes = {
  PvP: 'Arena',
  PvE: 'PvE',
  tournament: 'Tournament',
  friendly: 'Friendly Battle',
  clanMate: 'Clan Friendly Battle',
  challenge: 'Challenge',
  '2v2': '2 vs. 2',
  clanMate2v2: 'Clan Mate 2 vs. 2',
  challenge2v2: 'Challenge 2 vs. 2',
  touchdown2v2DraftPractice: 'Touchdown 2 vs. 2 (Draft Practice)',
  touchdown2v2Draft: 'Touchdown 2 vs. 2 (Draft)',
  unknown: 'Unknown'
};

export interface IGameTypes {
  [key: string]: string;
}

/**
 * Misc
 */
export interface IIconUrls {
  tiny?: string;
  small?: string;
  medium?: string;
  large: string;
}

export interface IApiPagination {
  paging: {
    cursors: string;
  };
}

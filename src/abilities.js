// ability score -> cumulative point buy cost
export const SCORE_COSTS = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

const STR = 'strength';
const DEX = 'dexterity';
const CON = 'constitution';
const INT = 'intelligence';
const WIS = 'wisdom';
const CHA = 'charisma';

// order matches character sheet
const ORDERED_ABILITIES = [
  STR,
  DEX,
  CON,
  INT,
  WIS,
  CHA,
];

export const INITIAL_ABILITY_SCORES = {};
for (const ability of ORDERED_ABILITIES) {
  INITIAL_ABILITY_SCORES[ability] = 8
}

// defualt number of points to start with
export const DEFAULT_INITIAL_POINTS = 27;

function getAbilityModifier(score) {
  return Math.floor(score / 2) - 5;
}

export function getAbilityModifierString(score) {
  const modifier = getAbilityModifier(score);
  const plusOrMinus = modifier >= 0 ? '+' : '-';
  return `${plusOrMinus}${Math.abs(modifier)}`;
}



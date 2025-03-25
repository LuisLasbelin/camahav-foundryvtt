export const CAMAHAV = {};

/**
 * The set of Ability Scores used within the system.
 * @type {Object}
 */
CAMAHAV.abilities = {
  str: 'CAMAHAV.Ability.Str.long',
  mov: 'CAMAHAV.Ability.Mov.long',
  con: 'CAMAHAV.Ability.Con.long',
  pre: 'CAMAHAV.Ability.Pre.long',
  wil: 'CAMAHAV.Ability.Wil.long',
  int: 'CAMAHAV.Ability.Int.long',
  per: 'CAMAHAV.Ability.Per.long',
  emp: 'CAMAHAV.Ability.Emp.long',
};

CAMAHAV.abilityAbbreviations = {
  str: 'CAMAHAV.Ability.Str.abbr',
  mov: 'CAMAHAV.Ability.Mov.abbr',
  con: 'CAMAHAV.Ability.Con.abbr',
  pre: 'CAMAHAV.Ability.Pre.abbr',
  wil: 'CAMAHAV.Ability.Wil.abbr',
  int: 'CAMAHAV.Ability.Int.abbr',
  per: 'CAMAHAV.Ability.Per.abbr',
  emp: 'CAMAHAV.Ability.Emp.abbr',
};

CAMAHAV.abilityCost = [2, 1, 0, -1, -3, -5, -8]
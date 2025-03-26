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

CAMAHAV.actionResult =[
  'CAMAHAV.Result.Bad',
  'CAMAHAV.Result.Poor',
  'CAMAHAV.Result.Fair',
  'CAMAHAV.Result.Good',
  'CAMAHAV.Result.VeryGood',
  'CAMAHAV.Result.Great',
  'CAMAHAV.Result.Excellent',
  'CAMAHAV.Result.Excellent',
  'CAMAHAV.Result.Incredible',
  'CAMAHAV.Result.Incredible',
  'CAMAHAV.Result.Heroic',
  'CAMAHAV.Result.Heroic',
  'CAMAHAV.Result.Legendary',
  'CAMAHAV.Result.Legendary',
  'CAMAHAV.Result.Legendary',
]

CAMAHAV.pointBuy = [0, 0, 1, 3, 5, 8]

CAMAHAV.Roman = ["Nullus", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]

CAMAHAV.Status = {
  "poison": { icon: "icons/magic/acid/dissolve-bone-skull.webp", type: "physical", label: "CAMAHAV.Status.Poison", id: "poison"},
  "fatigue": { icon: "icons/magic/control/silhouette-grow-shrink-tan.webp", type: "physical", label: "CAMAHAV.Status.Fatigue", id: "fatigue"},
  "wounded": { icon: "icons/skills/wounds/blood-drip-droplet-red.webp", type: "physical", label: "CAMAHAV.Status.Wounded", id: "wounded"},
  "stunned": { icon: "icons/magic/control/hypnosis-mesmerism-eye.webp", type: "mental", label: "CAMAHAV.Status.Stunned", id: "stunned"},
  "agitated": { icon: "icons/skills/social/intimidation-impressing.webp", type: "mental", label: "CAMAHAV.Status.Agitated", id: "agitated"},
  "cursed": { icon: "icons/magic/control/fear-fright-monster-grin-purple-blue.webp", type: "mental", label: "CAMAHAV.Status.Cursed", id: "cursed"}
}
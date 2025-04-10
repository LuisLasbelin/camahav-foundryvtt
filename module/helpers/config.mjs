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

CAMAHAV.actionResult = [
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

CAMAHAV.pointBuy = [0, 0, 1, 3, 5, 8, 11, 15, 20, 25, 30]


CAMAHAV.Roman = ["Nullus", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]

CAMAHAV.Status = {
  "poison": { icon: "icons/magic/acid/dissolve-bone-skull.webp", type: "physical", label: "CAMAHAV.Status.Poison", id: "poison" },
  "fatigue": { icon: "icons/magic/control/silhouette-grow-shrink-tan.webp", type: "physical", label: "CAMAHAV.Status.Fatigue", id: "fatigue" },
  "wounded": { icon: "icons/skills/wounds/blood-drip-droplet-red.webp", type: "physical", label: "CAMAHAV.Status.Wounded", id: "wounded" },
  "stunned": { icon: "icons/magic/control/hypnosis-mesmerism-eye.webp", type: "mental", label: "CAMAHAV.Status.Stunned", id: "stunned" },
  "agitated": { icon: "icons/skills/social/intimidation-impressing.webp", type: "mental", label: "CAMAHAV.Status.Agitated", id: "agitated" },
  "cursed": { icon: "icons/magic/control/fear-fright-monster-grin-purple-blue.webp", type: "mental", label: "CAMAHAV.Status.Cursed", id: "cursed" }
}

CAMAHAV.weaponTypes = {
  "onehanded": "CAMAHAV.WeaponTypes.OneHanded",
  "polearm": "CAMAHAV.WeaponTypes.Polearm",
  "heavy": "CAMAHAV.WeaponTypes.Heavy",
  "thrown": "CAMAHAV.WeaponTypes.Thrown",
  "fight": "CAMAHAV.WeaponTypes.Fight"
}

CAMAHAV.damageDegree = {
  "weak": "Weak",
  "medium": "Medium",
  "strong": "Strong"
}

CAMAHAV.skills = {
  "onehanded": "CAMAHAV.Skill.onehanded",
  "polearm": "CAMAHAV.Skill.polearm",
  "heavy": "CAMAHAV.Skill.heavy",
  "distance": "CAMAHAV.Skill.distance",
  "thrown": "CAMAHAV.Skill.thrown",
  "fight": "CAMAHAV.Skill.fight",
  "defense": "CAMAHAV.Skill.defense",
  "natural_science": "CAMAHAV.Skill.natural_science",
  "navigation": "CAMAHAV.Skill.navigation",
  "medicine": "CAMAHAV.Skill.medicine",
  "liguistic": "CAMAHAV.Skill.liguistic",
  "legends": "CAMAHAV.Skill.legends",
  "history": "CAMAHAV.Skill.history",
  "theology": "CAMAHAV.Skill.theology",
  "law": "CAMAHAV.Skill.law",
  "philisophy": "CAMAHAV.Skill.philisophy",
  "imperial_tongue": "CAMAHAV.Skill.imperial_tongue",
  "local": "CAMAHAV.Skill.local",
  "sorcery": "CAMAHAV.Skill.sorcery",
  "survival": "CAMAHAV.Skill.survival",
  "read_write": "CAMAHAV.Skill.read_write",
  "logistics": "CAMAHAV.Skill.logistics",
  "athletics": "CAMAHAV.Skill.athletics",
  "leadership": "CAMAHAV.Skill.leadership",
  "diplomacy": "CAMAHAV.Skill.diplomacy",
  "social": "CAMAHAV.Skill.social",
  "interpretation": "CAMAHAV.Skill.interpretation",
  "deception": "CAMAHAV.Skill.deception",
  "riding": "CAMAHAV.Skill.riding",
  "surgery": "CAMAHAV.Skill.surgery",
  "build_repair": "CAMAHAV.Skill.build_repair",
  "inventiveness": "CAMAHAV.Skill.inventiveness",
  "forage": "CAMAHAV.Skill.forage",
  "rate": "CAMAHAV.Skill.rate",
  "salvage": "CAMAHAV.Skill.salvage",
  "clairvoyance": "CAMAHAV.Skill.clairvoyance",
  "sense_presence": "CAMAHAV.Skill.sense_presence",
  "sense_power": "CAMAHAV.Skill.sense_power",
  "sense_corruption": "CAMAHAV.Skill.sense_corruption",
  "fae_semantics": "CAMAHAV.Skill.fae_semantics"
}
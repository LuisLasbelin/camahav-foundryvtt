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
  "fight": "CAMAHAV.WeaponTypes.Fight",
  "ranged": "CAMAHAV.WeaponTypes.Ranged"
}

CAMAHAV.damageDegree = {
  "weak": "Weak",
  "medium": "Medium",
  "strong": "Strong"
}

CAMAHAV.elements = {
  "fire": "CAMAHAV.Item.Spell.fire",
  "water": "CAMAHAV.Item.Spell.water",
  "earth": "CAMAHAV.Item.Spell.earth",
  "air": "CAMAHAV.Item.Spell.air",
  "life": "CAMAHAV.Item.Spell.life",
  "power": "CAMAHAV.Item.Spell.power",
  "senses": "CAMAHAV.Item.Spell.senses",
  "mind": "CAMAHAV.Item.Spell.mind",
  "esence": "CAMAHAV.Item.Spell.esence"
}

CAMAHAV.sigils = {
  "degrade": "CAMAHAV.Item.Spell.degrade",
  "sepparate": "CAMAHAV.Item.Spell.sepparate",
  "unite": "CAMAHAV.Item.Spell.unite",
  "modify": "CAMAHAV.Item.Spell.modify",
  "destroy": "CAMAHAV.Item.Spell.destroy",
  "transmute": "CAMAHAV.Item.Spell.transmute",
  "control": "CAMAHAV.Item.Spell.control",
  "create": "CAMAHAV.Item.Spell.create"
}

CAMAHAV.skills = {
  "onehanded": "CAMAHAV.Item.Skill.onehanded",
  "polearm": "CAMAHAV.Item.Skill.polearm",
  "heavy": "CAMAHAV.Item.Skill.heavy",
  "ranged": "CAMAHAV.Item.Skill.ranged",
  "thrown": "CAMAHAV.Item.Skill.thrown",
  "fight": "CAMAHAV.Item.Skill.fight",
  "defense": "CAMAHAV.Item.Skill.defense",
  "natural_science": "CAMAHAV.Item.Skill.natural_science",
  "navigation": "CAMAHAV.Item.Skill.navigation",
  "medicine": "CAMAHAV.Item.Skill.medicine",
  "liguistic": "CAMAHAV.Item.Skill.liguistic",
  "legends": "CAMAHAV.Item.Skill.legends",
  "history": "CAMAHAV.Item.Skill.history",
  "theology": "CAMAHAV.Item.Skill.theology",
  "law": "CAMAHAV.Item.Skill.law",
  "philisophy": "CAMAHAV.Item.Skill.philisophy",
  "imperial_tongue": "CAMAHAV.Item.Skill.imperial_tongue",
  "local": "CAMAHAV.Item.Skill.local",
  "sorcery": "CAMAHAV.Item.Skill.sorcery",
  "survival": "CAMAHAV.Item.Skill.survival",
  "read_write": "CAMAHAV.Item.Skill.read_write",
  "logistics": "CAMAHAV.Item.Skill.logistics",
  "athletics": "CAMAHAV.Item.Skill.athletics",
  "leadership": "CAMAHAV.Item.Skill.leadership",
  "diplomacy": "CAMAHAV.Item.Skill.diplomacy",
  "social": "CAMAHAV.Item.Skill.social",
  "interpretation": "CAMAHAV.Item.Skill.interpretation",
  "deception": "CAMAHAV.Item.Skill.deception",
  "riding": "CAMAHAV.Item.Skill.riding",
  "surgery": "CAMAHAV.Item.Skill.surgery",
  "build_repair": "CAMAHAV.Item.Skill.build_repair",
  "inventiveness": "CAMAHAV.Item.Skill.inventiveness",
  "forage": "CAMAHAV.Item.Skill.forage",
  "rate": "CAMAHAV.Item.Skill.rate",
  "salvage": "CAMAHAV.Item.Skill.salvage",
  "clairvoyance": "CAMAHAV.Item.Skill.clairvoyance",
  "sense_presence": "CAMAHAV.Item.Skill.sense_presence",
  "sense_power": "CAMAHAV.Item.Skill.sense_power",
  "sense_corruption": "CAMAHAV.Item.Skill.sense_corruption",
  "fae_semantics": "CAMAHAV.Item.Skill.fae_semantics",
  "fire": "CAMAHAV.Item.Spell.fire",
  "water": "CAMAHAV.Item.Spell.water",
  "earth": "CAMAHAV.Item.Spell.earth",
  "air": "CAMAHAV.Item.Spell.air",
  "degrade": "CAMAHAV.Item.Spell.degrade",
  "sepparate": "CAMAHAV.Item.Spell.sepparate",
  "unite": "CAMAHAV.Item.Spell.unite",
  "modify": "CAMAHAV.Item.Spell.modify"
}
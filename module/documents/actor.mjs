import {
  AbilityRoll
} from '../apps/ability-roll-app.mjs'

/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class CamahavActor extends Actor {
  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the actor source data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.camahav || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;

    // Check if ability values are correct
    for (const key in actorData.system.abilities) {
      if (actorData.system.abilities[key].value == 0) {
        var obj = { system: { abilities: {} } }
        obj.system.abilities[key] = { value: 1 }
        this.update(obj);
      }
      if (actorData.system.abilities[key].value < -2) {
        var obj = { system: { abilities: {} } }
        obj.system.abilities[key] = { value: -2 }
        this.update(obj);
      }
    }

    // Calculate the max Vigor and Resolve
    var max_vigor = 0
    for (const key in actorData.system.abilities) {
      if (["str", "con", "mov", "pre"].includes(key)) {
        if (actorData.system.abilities[key].value > 0) max_vigor += actorData.system.abilities[key].value
      }
    }
    var obj = { system: { vigor: { max: max_vigor } } }
    this.update(obj);

    var max_resolve = 0
    for (const key in actorData.system.abilities) {
      if (["per", "int", "wil", "emp"].includes(key)) {
        if (actorData.system.abilities[key].value > 0) max_resolve += actorData.system.abilities[key].value
      }
    }
    var obj = { system: { resolve: { max: max_resolve } } }
    this.update(obj);
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;
    systemData.xp = systemData.cr * systemData.cr * 100;
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    // Starts off by populating the roll data with `this.system`
    const data = { ...super.getRollData() };

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.type !== 'character') return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for easier access, or fall back to 0.
    if (data.attributes.level) {
      data.lvl = data.attributes.level.value ?? 0;
    }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.type !== 'npc') return;

    // Process additional NPC data here.
  }

  /**
   * Checks all status effects that apply to the given ability from the actor
   * @param {String} ability to which apply status effects
   * @returns array with the strings of the status effects applied
   */
  getStatusEffects(ability) {
    var status = []
    var data = this.getRollData()
    // Check status effects
    if (["str", "con"].includes(ability) && data.status.poison.value > data.vigor.value) status.push(CONFIG.CAMAHAV.Status.poison)
    if (["mov", "pre"].includes(ability) && data.status.fatigue.value > data.vigor.value) status.push(CONFIG.CAMAHAV.Status.fatigue)
    if (["str", "con", "mov", "pre"].includes(ability) && data.status.wounded.value > data.vigor.value) status.push(CONFIG.CAMAHAV.Status.wounded)
    if (["per", "int"].includes(ability) && data.status.stunned.value > data.resolve.value) status.push(CONFIG.CAMAHAV.Status.stunned)
    if (["wil", "emp"].includes(ability) && data.status.agitated.value > data.resolve.value) status.push(CONFIG.CAMAHAV.Status.agitated)
    if (["per", "int", "wil", "emp"].includes(ability) && data.status.cursed.value > data.resolve.value) status.push(CONFIG.CAMAHAV.Status.cursed)

    return status;
  }

  roll(ability, type = "ability") {
    const data = this.getRollData()
    if (type == ability) {
      return new AbilityRoll(
        this,
        "Ability",
        game.i18n.localize(CONFIG.CAMAHAV.abilities[ability]),
        ability,
        [
          {
            "value": data.abilities[ability].value,
            "type": "ability",
            "label": game.i18n.localize(CONFIG.CAMAHAV.abilities[ability])
          }
        ]).render(true)
    }
    if (type == "status") {
      return new AbilityRoll(
        this,
        "Status",
        game.i18n.localize(CONFIG.CAMAHAV.status[ability]),
        ability,
        [
          {
            "value": data.status[ability].value,
            "type": "status",
            "label": game.i18n.localize(CONFIG.CAMAHAV.status[ability].label)
          }
        ]).render(true)
    }
  }
}

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

    // Update effects
    if (actorData.system.status.poison > actorData.system.vigor.value) {
      if (actorData.effects.search("Poison").length < 1) {
        return this.createEmbeddedDocuments('ActiveEffect', [
          {
            name: game.i18n.format('Poison', {
              type: game.i18n.localize('CAMAHAV.Status.Poison'),
            }),
            img: 'icons/skills/toxins/poison-bottle-corked-fire-green.webp',
            origin: this.uuid,
            duration: {turns: 100},
            disabled: false
          },
        ]);
      }
    } else if(actorData.effects.search("Poison").length > 0) {
      actorData.effects.delete(actorData.effects.search("Poison")[0]._id)
    }
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
}

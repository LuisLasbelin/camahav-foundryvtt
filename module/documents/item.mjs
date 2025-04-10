import {
  AbilityRoll
} from '../apps/ability-roll-app.mjs'

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class CamahavItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }

  /**
   * Prepare a data object which defines the data schema used by dice roll commands against this Item
   * @override
   */
  getRollData() {
    // Starts off by populating the roll data with `this.system`
    const rollData = { ...super.getRollData() };

    // Quit early if there's no parent actor
    if (!this.actor) return rollData;

    // If present, add the actor's roll data
    rollData.actor = this.actor.getRollData();

    return rollData;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const item = this;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;

    // If there's no roll data, send a chat message.
    if (!this.system.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: item.system.description ?? '',
      });
    }
    // Otherwise, create a roll and send a chat message from it.
    else {
      // Retrieve roll data.
      const rollData = this.getRollData();

      // Invoke the roll and submit it to chat.
      pRoll(item.actor, label, [rollData.formula]);
      return;
    }
  }

  /**
   * Handle attack rolls
   * @returns 
   */
  async attack() {
    const item = this;
    const rollData = this.getRollData();

    console.log(this.actor.items)

    const skill = this.actor.items.filter((e)=>e.system.id === rollData.weaponType)[0].getRollData()

    return new AbilityRoll(
      this.actor,
      rollData,
      "Attack",
      item.name,
      [
        {
          "value": skill.value,
          "type": "skill",
          "label": rollData.weaponType
        },
        {
          "value": this.actor.getRollData().abilities[skill.ability].value,
          "type": "ability",
          "origin": skill.ability,
          "label": game.i18n.localize(CONFIG.CAMAHAV.abilities[skill.ability])
        }
      ]).render(true)
  }

  /**
   * Handle skill rolls
   * @returns 
   */
  async rollSkill() {
    const item = this;
    const rollData = this.getRollData();

    return new AbilityRoll(
      this.actor,
      rollData,
      "Skill",
      item.name,
      [
        {
          "value": rollData.value,
          "type": "skill",
          "label": item.name
        },
        {
          "value": item.actor.getRollData().abilities[item.system.ability].value,
          "type": "ability",
          "origin": item.system.ability,
          "label": game.i18n.localize(CONFIG.CAMAHAV.abilities[item.system.ability])
        }
      ]).render(true)
  }

  /**
  * Calculates the cost of the level of the skill based on the level
  * @param {Number} offset to add or substract to the current level
  * 
  * @returns {Number} total cost of the skill for the designed level
  */
  calculateSkillCost(actor, offset = 0) {
    let total = 0;
    // Get the ability assigned value
    const abilityValue = Math.max(0, this.actor.getRollData().abilities[this.system.ability].value);

    let skill_difficulty = 2;
    if (this.system.class) skill_difficulty = 1;
    if (this.system.advanced) skill_difficulty = 3;

    // for each level calculate the aggregated cost
    for (let i = 1; i <= this.system.value + offset; i++) {
      // if the level is lower than the assigned ability
      if (i <= abilityValue) total += skill_difficulty;
      if (i > abilityValue) total += 5 * (i - abilityValue) + skill_difficulty;
    }

    return total;
  }
}

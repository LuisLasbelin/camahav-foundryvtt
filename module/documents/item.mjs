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

  async rollSkill() {
    const item = this;
    const rollData = this.getRollData();

    return new AbilityRoll(
      this.actor,
      "Skill",
      item.name,
      item.ability,
      [
        {
          "value": rollData.value,
          "type": "skill",
          "label": item.name
        },
        {
          "value": item.actor.getRollData().abilities[item.ability].value,
          "type": "ability",
          "label": game.i18n.localize(CONFIG.CAMAHAV.abilities[item.ability])
        }
      ]).render(true)
  }

  /**
  * Calculates the cost of the level of the skill based on the level
  * @param {Number} offset to add or substract to the current level
  * 
  * @returns {Number} total cost of the skill for the designed level
  */
  calculateSkillCost(actor, offset = 0, skill_difficulty = 2) {
    let total = 0;
    // Get the ability assigned value
    const abilityValue = actor.getRollData().abilities[this.system.ability].value;

    // for each level calculate the aggregated cost
    for (let i = 1; i <= this.system.value + offset; i++) {
      // if the level is lower than the assigned ability
      if (i <= abilityValue) total += skill_difficulty;
      if (i > abilityValue) total += 5 * (i - abilityValue) + skill_difficulty;
    }

    return total;
  }
}

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
      pRoll(this.actor, label, [rollData.formula]);
      return;
    }
  }

  async rollSkill() {
    const item = this;
    var ability = "str"
    const rollData = this.getRollData();

    for (const key in rollData.abilities) {
      if (rollData.abilities[key].value > 0) {
        ability = key
      }
    }

    return new AbilityRoll(this.actor, "Skill", item.name, ability,  [{ "value": rollData.value, "type": "skill", "label": item.name }]).render(true)
  }
}

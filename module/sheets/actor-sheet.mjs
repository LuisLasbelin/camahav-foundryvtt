import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from '../helpers/effects.mjs';

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class CamahavActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['camahav', 'sheet', 'actor'],
      width: 700,
      height: 700,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'features',
        },
      ],
    });
  }

  /** @override */
  get template() {
    return `systems/camahav/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = context.data;

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Prepare character data and items.
    if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(
      // A generator that returns all effects stored on the actor
      // as well as any items
      this.actor.allApplicableEffects()
    );

    // Enrich thee text for the biography
    context.enrichedHtml = {
      biography: await TextEditor.enrichHTML(context.system.biography ?? ''),
    };

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(context) {
    context.pointBuy = 0
    context.skillsTotal = 0
    // Handle ability scores.
    for (let [k, v] of Object.entries(context.system.abilities)) {
      v.label = game.i18n.localize(CONFIG.CAMAHAV.abilities[k]) ?? k;
      if (v.value > 0) context.pointBuy += CONFIG.CAMAHAV.pointBuy[v.value];
      else context.pointBuy += v.value;
    }

    for (let item of context.items) {
      // Only add up value of skills
      if (item.type === "skill") {
        if (item.system.value > 0) context.skillsTotal += this.actor.calculateSkillCost(item);
      }
    }

    context.status = {}
    for (let [k, v] of Object.entries(context.system.status)) {
      // add icon data
      v.config = CONFIG.CAMAHAV.Status[k]

      if (v.type == "physical" && v.value > context.system.vigor.value) {
        context.status[k] = true
      }
      if (v.type == "mental" && v.value > context.system.resolve.value) {
        context.status[k] = true
      }
    }

    context.maxCarry = (context.system.abilities.str.value + context.system.abilities.con.value) * 2;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    // Initialize containers.
    const gear_types = ["item", "armor", "weapon", "shield"]
    const gear = [];
    const armor = [];
    const weapons = [];
    const features = [];
    const classes = [];
    const skills = [];
    const spells = {
      "fire": [],
      "water": [],
      "earth": [],
      "air": [],
      "life": [],
      "mind": [],
      "sense": [],
      "power": [],
      "esence": []
    };
    let totalCarry = 0;

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      if (i.system.weight) totalCarry += i.system.weight;

      i.img = i.img || Item.DEFAULT_ICON;
      // Append to gear if it's not equipped
      if (gear_types.includes(i.type) && !i.system.equipped) {
        gear.push(i);
      }
      // Append if it is equipped on the character
      else if (i.system.equipped > 0) {
        if (i.type === "armor") {
          armor.push(i);
        }
        if (i.type === "weapon" || i.type === "shield") {
          weapons.push(i);
        }
      }
      // Append to features.
      else if (i.type === 'feature') {
        features.push(i);
      }
      // Append to classes.
      else if (i.type === 'class') {
        classes.push(i);
      }
      // Append to skills.
      else if (i.type === 'skill') {
        skills.push(i);
      }
      // Append to spells.
      else if (i.type === 'spell') {
        if (i.system.element != undefined) {
          spells[i.system.element].push(i);
        }
      }
    }

    // Assign and return
    context.gear = gear;
    context.features = features;
    context.classes = classes;
    context.skills = skills;
    context.spells = spells;
    context.armor = armor;
    context.weapons = weapons;
    context.totalCarry = totalCarry;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.on('click', '.item-edit', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    html.on('click', '.item-equip', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      if (item.system.equipped == 1) item.update({ system: { equipped: 0 } })
      if (item.system.equipped == 0) item.update({ system: { equipped: 1 } })
    });

    html.on('change', '.item-uses', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.update({ system: { uses: { value: ev.currentTarget.value } } })
    });

    html.on('click', '.item-attack', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      if (item) return item.attack();
    });

    // Add Inventory Item
    html.on('click', '.item-create', this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.on('click', '.item-delete', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    html.on('click', '.item-add', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.update({ system: { quantity: Math.max(0, item.system.quantity + 1) } })
    });

    html.on('click', '.item-reduce', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.update({ system: { quantity: Math.max(0, item.system.quantity - 1) } })
    });

    // Active Effect management
    html.on('click', '.effect-control', (ev) => {
      const row = ev.currentTarget.closest('li');
      const document =
        row.dataset.parentId === this.actor.id
          ? this.actor
          : this.actor.items.get(row.dataset.parentId);
      onManageActiveEffect(ev, document);
    });

    // Rollable abilities.
    html.on('click', '.rollable', this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = (ev) => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains('inventory-header')) return;
        li.setAttribute('draggable', true);
        li.addEventListener('dragstart', handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data,
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system['type'];

    // Finally, create the item!
    return await Item.create(itemData, { parent: this.actor });
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
      if (dataset.rollType == 'skill') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.rollSkill();
      }
    }

    // Ability rolls
    if (dataset.roll) {
      if (dataset.rollType == 'ability') {
        return this.actor.roll(dataset.ability, dataset.roll, "ability")
      }
      if (dataset.rollType == 'status') {
        return this.actor.roll(dataset.status, dataset.roll, "status")
      }
      // Direct formula
      let label = dataset.label ? `[ability] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }
}

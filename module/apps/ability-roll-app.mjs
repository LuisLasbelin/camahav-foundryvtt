/**
 * Main class to handle ability rolls and skill rolls
 */
class AbilityRoll extends FormApplication {
    /**
     * 
     * @param {Actor} actor 
     * @param {String} type can be ability, skill, item or binary
     * @param {String} label to show on the message
     * @param {String} ability represents the 3-letter ability used to set Status Effects
     * @param {Array} rolls objects containing type, value and label for each roll
     * @param {Number} free_successes given free successes for the roll
     * @param {Number} target_num target number for each roll
     * @param {Number} difficulty successes needed to be a success, defaults to 0 if there is no difficulty set
     */
    constructor(actor, type = "", label = "", used_ability = "", rolls = [], critRange = 0, free_successes = 0, target_num = 4, difficulty = 0, weapon_id = "") {
        super();
        this.actor = actor;
        this.type = type;
        this.label = label;
        this.used_ability = used_ability;
        this.rolls = rolls;
        this.critRange = critRange;
        this.difficulty = difficulty;
        this.target_num = target_num;
        this.free_successes = free_successes;
        this.weapon_id = weapon_id;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ['form'],
            popOut: true,
            width: 400,
            template: `systems/camahav/templates/applications/ability-roll.hbs`,
            id: 'ability_roll',
            title: game.i18n.localize('CAMAHAV.AbilityRoll')
        });
    }

    getData() {
        var status = []
        for (const key in CONFIG.CAMAHAV.abilities) {
            status.push({ ability: key, effects: this.actor.getStatusEffects(key) })
        }
        // Send data to the template
        return {
            status: status,
            label: this.label,
            penalties: this.roll_penalties,
            rolls: this.rolls,
            used_ability: this.used_ability,
            free_successes: this.free_successes,
            abilities: CONFIG.CAMAHAV.abilities
        };
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Update status effects when choosing an ability
        html.on('change', '.ability-select', (ev) => {
            const select = ev.currentTarget;
            console.log(select)
            this.used_ability = select.value;
            this.render(true)
        });
    }

    async critRoll(event, dice) {
        console.log(event)
    }

    /**
     * Make a Poisson Roll with the form data
     * @param {*} event 
     * @param {*} formData 
     */
    async pRoll(event, formData) {
        console.log(formData)

        var results = []
        var formula = ""
        var free_successes = formData.free_successes

        // Build the complete formula for the roll
        for (let i = 0; i < this.rolls.length; i++) {
            // Equal the value of the roll to the one received from the form
            this.rolls[i].value = formData[this.rolls[i].type]
            // Check for penalties on the roll
            for (const status in formData.status) {
                // if the penalty is to the ability, do not roll it
                if (this.rolls[i].type == "ability") this.rolls[i].value = 0;
            }

            // If the roll is safe convert half of the dice to automatic success, apllied after the status effects
            if (formData.safe && this.rolls[i].value >= 2) {
                var reduction = Math.floor(this.rolls[i].value / 2);
                free_successes += reduction;
                this.rolls[i].value -= reduction;
            }

            if (this.rolls[i].value > 0) formula += `+${this.rolls[i].value}d8[${this.rolls[i].type}]`
            if (this.rolls[i].value == 0) formula += `+1d8[${this.rolls[i].type}]`
            if (this.rolls[i].value < 0) formula += `+1d8[${this.rolls[i].type}]`
            if (this.rolls[i].value < -1) formula += `+1d0[${this.rolls[i].type}]`
        } // for each roll

        // Add free successes
        formula += "+" + free_successes;

        // Create the roll with the formula
        var r = new Roll(formula);

        await r.evaluate();

        r._total = 0;

        // Add a crit roll with each 8 in the dice rolled
        let critRolls = 0;

        for (const term of r.terms) {

            // If there are no results, omit the term
            if (!term.results) {
                if (term.number) {
                    var free_rolls = []
                    for (let i = 0; i < term.number; i++) {
                        free_rolls.push({ result: 6, success: 1, free: true })
                    }
                    results.push(free_rolls)
                    r._total += term.number;
                }
                continue;
            }

            var dice = this.rolls.filter((el) => el.type == term.options.flavor)[0].value;

            if (dice < -1) {
                results.push({ result: 0, not: 1 })
            }

            if (dice == -1) {

                r._total += term.results.filter((el) => el.result == 8).length

                var temp_r = term.results;
                for (let i = 0; i < temp_r.length; i++) {
                    if (temp_r[i].result == 8) {
                        temp_r[i].success = 1;
                        critRolls += 1;
                    }
                    else if (temp_r[i].result < 8) temp_r[i].not = 1
                }
                results.push(temp_r);
            }

            if (dice == 0) {

                r._total += term.results.filter((el) => el.result >= 7).length + term.results.filter((el) => el.result == 8).length

                var temp_r = term.results
                for (let i = 0; i < temp_r.length; i++) {
                    if (temp_r[i].result == 8) {
                        temp_r[i].double = 1;
                        critRolls += 1;
                    }
                    else if (temp_r[i].result == 7) temp_r[i].success = 1
                    else if (temp_r[i].result < 7) temp_r[i].not = 1
                }
                results.push(temp_r);
            }

            if (dice > 0) {
                r._total += term.results.filter((el) => el.result >= this.target_num).length + term.results.filter((el) => el.result >= 7).length + term.results.filter((el) => el.result == 8).length

                var temp_r = term.results
                for (let i = 0; i < temp_r.length; i++) {
                    if (temp_r[i].result == 8) {
                        temp_r[i].triple = 1;
                        critRolls += 1;
                    }
                    else if (temp_r[i].result == 7) temp_r[i].double = 1
                    else if (temp_r[i].result >= this.target_num) temp_r[i].success = 1
                    else if (temp_r[i].result < this.target_num) temp_r[i].not = 1
                }
                results.push(temp_r)
            }
        } // for each term

        const roll_total = r._total - formData.target;

        const messageData = {
            total: roll_total,
            roll: r,
            target: formData.target,
            status: this.actor.getStatusEffects(this.ability),
            results: results,
            performance: game.i18n.localize(CONFIG.CAMAHAV.actionResult[r._total]),
            actor: this.actor,
            label: this.label,
            critRange: this.critRange,
            critRolls: critRolls
        }

        return messageData;
    }

    /**
     * Makes a roll to reduce status effect
     * @param {*} event 
     * @param {*} formData 
     */
    async statusRoll(event, formData) {

        console.log(formData)

        var results = []
        var formula = formData.status + "d8[status]"

        // Create the roll with the formula
        var r = new Roll(formula);

        await r.evaluate();

        r._total = 0

        let critRolls = 0;

        for (const term of r.terms) {

            r._total += term.results.filter((el) => el.result == 8).length

            var temp_r = term.results;
            for (let i = 0; i < temp_r.length; i++) {
                if (temp_r[i].result == 8) {
                    temp_r[i].success = 1;
                    critRolls += 1;
                }
                else if (temp_r[i].result < 8) temp_r[i].not = 1
            }
            results.push(temp_r);
        }

        const content = await renderTemplate('systems/camahav/templates/message/roll.hbs', {
            total: r._total,
            results: results,
            performance: game.i18n.localize(CONFIG.CAMAHAV.actionResult[r._total]),
            actor: this.actor,
            label: this.label
        })

        r.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            content: content,
            rollMode: game.settings.get('core', 'rollMode'),
        });
    }

    async createMessage(messageData) {
        const content = await renderTemplate('systems/camahav/templates/message/roll.hbs', messageData)

        const msg = await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            content: content,
            rollMode: game.settings.get('core', 'rollMode'),
        })

        // Render roll on DiceSoNice
        if (game.modules.has("dice-so-nice")) game.dice3d.renderRolls(msg, [messageData.roll]);
    }

    async _updateObject(event, formData) {
        if (formData.status) {
            this.statusRoll(event, formData);
            return;
        }
        const messageData = await this.pRoll(event, formData);
        
        this.createMessage(messageData);
        return;
    }
}

export { AbilityRoll }
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
    constructor(actor, type = "", label = "", ability = "", rolls = [], free_successes = 0, target_num = 4, difficulty = 0) {
        super();
        this.actor = actor;
        this.type = type;
        this.label = label;
        this.ability = ability;
        this.rolls = rolls;
        this.difficulty = difficulty;
        this.target_num = target_num;
        this.roll_penalties = this.actor.getStatusEffects(this.ability)
        this.free_successes = free_successes;
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
        // Send data to the template
        return {
            status: this.actor.getStatusEffects(this.ability),
            label: this.label,
            penalties: this.roll_penalties,
            rolls: this.rolls,
            ability: this.ability,
            free_successes: this.free_successes
        };
    }

    activateListeners(html) {
        super.activateListeners(html);
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
            for (const penalty in this.roll_penalties) {
                // if the penalty is to the same roll, apply it
                if (this.rolls[i].type == "ability" || this.rolls[i].type == "skill") this.rolls[i].value -= 1;
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
        }

        // Add free successes
        formula += "+" + free_successes;

        console.log(formula)
        // Create the roll with the formula
        var r = new Roll(formula);

        await r.evaluate();

        r._total = 0

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
                    if (temp_r[i].result == 8) temp_r[i].success = 1
                    else if (temp_r[i].result < 8) temp_r[i].not = 1
                }
                results.push(temp_r);
            }

            if (dice == 0) {

                r._total += term.results.filter((el) => el.result >= 7).length + term.results.filter((el) => el.result == 8).length

                var temp_r = term.results
                for (let i = 0; i < temp_r.length; i++) {
                    if (temp_r[i].result == 8) temp_r[i].double = 1
                    else if (temp_r[i].result == 7) temp_r[i].success = 1
                    else if (temp_r[i].result < 7) temp_r[i].not = 1
                }
                results.push(temp_r);
            }

            if (dice > 0) {
                r._total += term.results.filter((el) => el.result >= this.target_num).length + term.results.filter((el) => el.result >= 7).length + term.results.filter((el) => el.result == 8).length

                var temp_r = term.results
                for (let i = 0; i < temp_r.length; i++) {
                    if (temp_r[i].result == 8) temp_r[i].triple = 1
                    else if (temp_r[i].result == 7) temp_r[i].double = 1
                    else if (temp_r[i].result >= this.target_num) temp_r[i].success = 1
                    else if (temp_r[i].result < this.target_num) temp_r[i].not = 1
                }
                results.push(temp_r)
            }
        } // for

        console.log(results)
        const content = await renderTemplate('systems/camahav/templates/message/roll.hbs', {
            total: CONFIG.CAMAHAV.Roman[r._total],
            status: this.actor.getStatusEffects(this.ability),
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

    async _updateObject(event, formData) {
        this.pRoll(event, formData)
        return;
    }
}

export { AbilityRoll }
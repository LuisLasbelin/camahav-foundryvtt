/**
 * Main class to handle ability rolls and skill rolls
 */
class AbilityRoll extends FormApplication {
    /**
     * 
     * @param {*} actor 
     * @param {*} type 
     * @param {*} label
     * @param {*} ability 
     * @param {*} rolls 
     * @param {*} roll_penalties 
     * @param {*} free_successes 
     */
    constructor(actor, type = "", label = "", ability = "", rolls = {}, free_successes = 0, difficulty = 0, target_num = 4) {
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
            height: 200,
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
            ability: this.ability
        };
    }

    activateListeners(html) {
        super.activateListeners(html);
    }

    async pRoll(event, formData) {
        var results = []
        var formula = ""

        // Build the complete formula for the roll
        for (const key in this.rolls) {
            for (const penalty in this.roll_penalties) {
                // if the penalty is to the same roll, apply it
                if(key == "ability" || key == "skill") this.rolls[key] -= 1;
            }
            if (this.rolls[key] > 0) formula += `+${this.rolls[key]}d8[${key}]`
            if (this.rolls[key] == 0) formula += `+1d8[${key}]`
            if (this.rolls[key] < 0) formula += `+1d8[${key}]`
            if (this.rolls[key] < -1) formula += `+1d0[${key}]`
        }

        var r = new Roll(formula);

        await r.evaluate();

        r._total = 0

        for (const term of r.terms) {

            var dice = this.rolls[term.options.flavor];

            if (dice < -1) {
                results.push({result: 0, not: 1})
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

        const content = await renderTemplate('systems/camahav/templates/message/roll.hbs', {
            total: CONFIG.CAMAHAV.Roman[r._total],
            status: this.actor.getStatusEffects(this.ability),
            results: results,
            performance: game.i18n.localize(CONFIG.CAMAHAV.actionResult[r._total]),
            actor: this.actor
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
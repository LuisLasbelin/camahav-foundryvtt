/**
 * Custom function to make a Poisson roll of d8 dice.
 * @param {Number} dice number of dice to be rolled.
 * @param {Number} target minimum number to get a single success.
 * @param {Number} difficulty amount of successes needed.
 */
export async function pRoll(_actor, _label = "CAMAHAV.ChanceRoll", _dice = 2, _target = 6, _difficulty = 3) {

    let r = new Roll();
    var results = {}

    if (_dice == -2) {
        r = new Roll(`1d8`);

        // Execute the roll
        await r.evaluate();

        r._total = r.terms[0].results.filter((el) => el.result == 8).length

        results = r.terms[0].results
        for (let i = 0; i < results.length; i++) {
            if (results[i].result == 8) results[i].success = 1
            else if (results[i].result < 8) results[i].not = 1
        }
    }

    if (_dice == -1) {
        r = new Roll(`1d8`);

        // Execute the roll
        await r.evaluate();

        r._total = r.terms[0].results.filter((el) => el.result >= 7).length + r.terms[0].results.filter((el) => el.result == 8).length

        results = r.terms[0].results
        for (let i = 0; i < results.length; i++) {
            if (results[i].result == 8) results[i].double = 1
            else if (results[i].result == 7) results[i].success = 1
            else if (results[i].result < 7) results[i].not = 1
        }
    }

    if (_dice > 0) {
        r = new Roll(`${_dice}d8`);

        // Execute the roll
        await r.evaluate();

        r._total = r.terms[0].results.filter((el) => el.result >= _target).length + r.terms[0].results.filter((el) => el.result >= 7).length + r.terms[0].results.filter((el) => el.result == 8).length

        results = r.terms[0].results
        for (let i = 0; i < results.length; i++) {
            if (results[i].result == 8) results[i].triple = 1
            else if (results[i].result == 7) results[i].double = 1
            else if (results[i].result >= _target) results[i].success = 1
            else if (results[i].result < _target) results[i].not = 1
        }
    }

    const content = await renderTemplate('systems/camahav/templates/message/roll.hbs', {
        total: r._total,
        results: results,
        performance: game.i18n.localize(CONFIG.CAMAHAV.actionResult[r._total])
    })

    r.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: _actor }),
        content: content,
        rollMode: game.settings.get('core', 'rollMode'),
    });
}
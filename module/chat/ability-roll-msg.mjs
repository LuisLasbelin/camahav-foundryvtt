export function addChatListeners(html) {
    html.on("click", ".crit", onCritRoll);
}

async function onCritRoll(event) {
    const card = event.currentTarget.closest(".message");
    const diceRolled = card.querySelectorAll('.d8-result')
    const actor = card.dataset.actorId;

    let critRolls = 0;
    for (const r of diceRolled) {
        if (r.innerHTML == "8") critRolls += 1;
    }

    const roll = new Roll(`${critRolls}d8`)
    await roll.evaluate();

    let roll_total = 0;
    let results = [];

    for (const term of roll.terms) {
        var temp_r = term.results
        for (let i = 0; i < temp_r.length; i++) {
            if (temp_r[i].result == 8) temp_r[i].success = 1;
            else temp_r[i].not = 1
        }
        results.push(temp_r)
    }

    const content = await renderTemplate('systems/camahav/templates/message/roll.hbs', {
        total: roll_total,
        results: results,
        actor: actor,
        label: "CAMAHAV.Crit"
    })

    roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: content,
        rollMode: game.settings.get('core', 'rollMode'),
    })
}
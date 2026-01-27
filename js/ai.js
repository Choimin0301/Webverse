/**
 * AI (적) 턴 로직
 */
function startEnemyTurn() {
    // 턴 시작 오버레이
    showTurnOverlay(false);

    let eTurn = myTurnCount + (isFirst ? 0 : 1);
    eMaxMana = Math.min(10, isFirst ? myTurnCount : myTurnCount + 1);
    eMana = eMaxMana;
    eField.forEach(c => c.canAttack = true);
    draw(eDeck, eHand);

    updateView();

    // 카드 플레이를 딜레이로 순차 실행
    let playDelay = 1200;
    const cardsToPlay = [];

    eHand.sort((a, b) => b.cost - a.cost);
    for (let i = eHand.length - 1; i >= 0; i--) {
        let c = eHand[i], cost = c.cost;
        if (c.enhance && eMana >= c.enhance.cost) cost = c.enhance.cost;
        if (eMana >= cost && eField.length + cardsToPlay.length < 5) {
            cardsToPlay.push({ card: c, index: i, cost: cost });
            eMana -= cost;
        }
    }

    // 순차적으로 카드 플레이
    cardsToPlay.forEach((item, idx) => {
        setTimeout(() => {
            playEnemyCard(item.card, item.index, item.cost);
        }, playDelay + idx * 600);
    });

    // 진화 시도
    const evolveDelay = playDelay + cardsToPlay.length * 600 + 300;
    setTimeout(() => {
        const unlock = isFirst ? 4 : 5;
        if (eTurn >= unlock && eEP > 0 && eField.length > 0) {
            const tIdx = eField.findIndex(c => !c.evolved);
            if (tIdx >= 0) {
                const t = eField[tIdx];
                eEP--;
                t.evolved = true;
                t.curAtk += 2;
                t.curHp += 2;
                t.canAttack = true;
                log("⚡ 적 진화");

                // 진화 애니메이션
                const cardEl = document.getElementById('enemy-field').children[tIdx];
                if (cardEl) animateEvolve(cardEl);

                setTimeout(() => updateView(), 800);
            }
        }
    }, evolveDelay);

    // 공격 실행
    const attackDelay = evolveDelay + 1000;
    setTimeout(() => executeEnemyAttacks(), attackDelay);
}

/**
 * 적 카드 플레이
 */
function playEnemyCard(card, handIndex, cost) {
    const actualIndex = eHand.findIndex(c => c.uid === card.uid);
    if (actualIndex < 0) return;

    eHand.splice(actualIndex, 1);
    card.summonTurn = 999;
    const ps = card.passives || [];
    if (ps.includes('rush') || ps.includes('storm')) card.canAttack = true;
    eField.push(card);
    log(`🔴 적 ${card.name} 소환`);

    if (cost > card.cost && card.enhance) applyEffects(card.enhance.effects, card, null);
    else if (card.fanfare) applyEffects(card.fanfare, card, null);

    updateView();

    // 소환 애니메이션
    setTimeout(() => {
        const fieldEl = document.getElementById('enemy-field');
        const lastCard = fieldEl.lastElementChild;
        if (lastCard) animateSummon(lastCard);
    }, 50);
}

/**
 * 적 공격 실행
 */
function executeEnemyAttacks() {
    const pWard = pField.some(c => (c.passives || []).includes('ward') && !(c.passives || []).includes('ambush'));

    let attackIndex = 0;
    const attackers = eField.filter(att => att.canAttack);

    function processNextAttack() {
        if (attackIndex >= attackers.length) {
            setTimeout(() => {
                resolveDeaths();
                updateView();
                startPlayerTurn();
            }, 500);
            return;
        }

        const att = attackers[attackIndex];
        const attIdx = eField.indexOf(att);
        if (attIdx < 0) {
            attackIndex++;
            processNextAttack();
            return;
        }

        const attPs = att.passives || [];
        const attackerEl = document.getElementById('enemy-field').children[attIdx];

        // 리더 킬 가능하면 리더 공격
        if (!pWard && att.curAtk >= pHP) {
            const heroEl = document.getElementById('player-hero');
            if (attackerEl && heroEl) {
                animateAttack(attackerEl, heroEl, false, () => {
                    pHP -= att.curAtk;
                    animateHeroDamage(heroEl, att.curAtk);
                    animateHPChange(document.getElementById('p-hp'), true);
                    log("🔴 적 리더 공격!");
                    updateView();
                    attackIndex++;
                    setTimeout(processNextAttack, 400);
                });
            }
            return;
        }

        // 수호 우선 공격
        let targetIdx = -1;
        if (pWard) {
            targetIdx = pField.findIndex(c => (c.passives || []).includes('ward'));
        } else if (pField.length > 0) {
            targetIdx = 0;
        }

        if (targetIdx >= 0) {
            const target = pField[targetIdx];
            const targetEl = document.getElementById('player-field').children[targetIdx];

            if (attackerEl && targetEl) {
                animateAttack(attackerEl, targetEl, false, () => {
                    // 피해 애니메이션
                    animateDamage(targetEl, att.curAtk);
                    setTimeout(() => {
                        if (attackerEl) animateDamage(attackerEl, target.curAtk);
                    }, 100);

                    att.curHp -= target.curAtk;
                    target.curHp -= att.curAtk;
                    log(`⚔️ 적 ${att.name} -> ${target.name}`);

                    setTimeout(() => {
                        resolveDeaths();
                        updateView();
                        attackIndex++;
                        setTimeout(processNextAttack, 400);
                    }, 300);
                });
            }
        } else if (!pWard && !attPs.includes('rush')) {
            // 리더 공격
            const heroEl = document.getElementById('player-hero');
            if (attackerEl && heroEl) {
                animateAttack(attackerEl, heroEl, false, () => {
                    pHP -= att.curAtk;
                    animateHeroDamage(heroEl, att.curAtk);
                    animateHPChange(document.getElementById('p-hp'), true);
                    log("🔴 적 리더 공격");
                    updateView();
                    attackIndex++;
                    setTimeout(processNextAttack, 400);
                });
            }
        } else {
            attackIndex++;
            processNextAttack();
        }
    }

    processNextAttack();
}

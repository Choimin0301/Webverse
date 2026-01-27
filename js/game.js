/**
 * 게임 상태 변수
 */
let myDeckList = [];
let pDeck = [], eDeck = [], pHand = [], eHand = [], pField = [], eField = [];
let myTurnCount = 0, isPlayerTurn = false;
let pMana = 0, pMaxMana = 0, eMana = 0, eMaxMana = 0;
let pHP = 20, eHP = 20;
let pEP = 0, eEP = 0;
let isFirst = true;
let evolvedThisTurn = false;
let isEvolveMode = false;
let draggedIdx = -1, dragSource = null;

/**
 * 카드 인스턴스 생성
 */
function createInstance(data) {
    return {
        ...data, uid: Math.random().toString(),
        curAtk: data.atk, curHp: data.hp,
        canAttack: false, hasAttacked: false, evolved: false, summonTurn: -1,
        passives: data.passives ? [...data.passives] : []
    };
}

/**
 * 게임 시작
 */
function startGame(userFirst) {
    document.getElementById('start-overlay').style.display = 'none';
    isFirst = userFirst;

    // 현재 덱 자동 저장
    saveCurrentDeck();

    pDeck = [];
    myDeckList.forEach(item => {
        for (let i = 0; i < item.count; i++) pDeck.push(createInstance(item.data));
    });
    shuffle(pDeck);

    eDeck = [];
    for (let i = 0; i < 40; i++) eDeck.push(createInstance(cardsDB[Math.floor(Math.random() * (cardsDB.length - 1))]));

    for (let i = 0; i < 3; i++) { draw(pDeck, pHand); draw(eDeck, eHand); }

    if (isFirst) {
        pEP = 2; eEP = 3; draw(eDeck, eHand);
        startPlayerTurn();
    } else {
        pEP = 3; eEP = 2; draw(pDeck, pHand);
        startEnemyTurn();
    }
    updateView();
}

/**
 * 플레이어 턴 시작
 */
function startPlayerTurn() {
    isPlayerTurn = true; myTurnCount++;
    pMaxMana = Math.min(10, myTurnCount); pMana = pMaxMana;
    evolvedThisTurn = false; isEvolveMode = false;
    pField.forEach(c => {
        c.canAttack = true;
        c.hasAttacked = false;
    });
    draw(pDeck, pHand);
    log(`--- ${myTurnCount}턴 시작 ---`);
    document.getElementById('btn-end').disabled = false;

    // 턴 시작 오버레이
    showTurnOverlay(true);

    updateView();

    // 드로우 애니메이션
    setTimeout(() => {
        const handEl = document.getElementById('player-hand');
        const lastCard = handEl.lastElementChild;
        if (lastCard) animateDraw(lastCard);
    }, 100);
}

/**
 * 턴 종료
 */
function endTurn() {
    if (!isPlayerTurn) return;
    isPlayerTurn = false; isEvolveMode = false;
    document.getElementById('btn-end').disabled = true;
    pField.forEach(c => c.canAttack = false);
    updateView();
    setTimeout(startEnemyTurn, 1000);
}

/**
 * 카드 플레이
 */
function playCard(idx) {
    const card = pHand[idx];
    let cost = card.cost; let enhanced = false;
    if (card.enhance && pMana >= card.enhance.cost) { cost = card.enhance.cost; enhanced = true; }

    if (pMana >= cost && pField.length < 5) {
        pMana -= cost; pHand.splice(idx, 1);
        card.summonTurn = myTurnCount;
        if ((card.passives || []).includes('rush') || (card.passives || []).includes('storm')) card.canAttack = true;
        pField.push(card);
        log(`${card.name} 소환`);
        if (card.fanfare) applyEffects(card.fanfare, card, null);
        if (enhanced && card.enhance.effects) applyEffects(card.enhance.effects, card, null);
        updateView();

        // 소환 애니메이션
        setTimeout(() => {
            const fieldEl = document.getElementById('player-field');
            const lastCard = fieldEl.lastElementChild;
            if (lastCard) animateSummon(lastCard);
        }, 50);
    }
}

/**
 * 공격
 */
function attack(attackerIdx, targetType, targetIdx) {
    // 유효성 검사
    if (attackerIdx < 0 || attackerIdx >= pField.length) return;

    const att = pField[attackerIdx];
    if (!att || !att.canAttack) return;

    const isSummonTurn = att.summonTurn === myTurnCount;
    const ps = att.passives || [];
    const hasStorm = ps.includes('storm');
    const warders = eField.filter(c => (c.passives || []).includes('ward') && !(c.passives || []).includes('ambush'));

    if (targetType === 'hero') {
        if (isSummonTurn && !hasStorm) { log("돌진은 리더 공격 불가"); return; }
        if (warders.length > 0) { log("수호 하수인이 있습니다."); return; }
    }
    if (targetType === 'unit') {
        if (targetIdx < 0 || targetIdx >= eField.length) return;
        const target = eField[targetIdx];
        if (!target) return;
        const tps = target.passives || [];
        if (tps.includes('ambush') || tps.includes('intimidate')) return;
        if (warders.length > 0 && !tps.includes('ward')) { log("수호 하수인을 먼저 공격하세요."); return; }
    }

    att.canAttack = false; att.hasAttacked = true;
    if (ps.includes('ambush')) removePassive(att, 'ambush');

    // 공격 애니메이션 (animateAttack 내부에서 폴백 처리)
    const attackerEl = document.getElementById('player-field').children[attackerIdx];
    const targetEl = targetType === 'unit'
        ? document.getElementById('enemy-field').children[targetIdx]
        : document.getElementById('enemy-hero');

    if (attackerEl && targetEl && typeof animateAttack === 'function') {
        try {
            animateAttack(attackerEl, targetEl, true, () => {
                processAttackDamage(att, targetType, targetIdx, ps);
            });
        } catch (e) {
            processAttackDamage(att, targetType, targetIdx, ps);
        }
    } else {
        processAttackDamage(att, targetType, targetIdx, ps);
    }
}

/**
 * 공격 피해 처리 (애니메이션 후 실행)
 */
function processAttackDamage(att, targetType, targetIdx, ps) {
    if (!att) return;

    let targetCard = targetType === 'unit' ? eField[targetIdx] : null;
    if (att.strike) applyEffects(att.strike, att, targetCard);

    if (targetType === 'unit') {
        const def = eField[targetIdx];
        if (!def) {
            resolveDeaths();
            updateView();
            return;
        }

        if (att.clash) applyEffects(att.clash, att, def);
        if (def.clash) applyEffects(def.clash, def, att);

        if (att.curHp > 0 && def.curHp > 0) {
            const dmgToDef = calcDmg(att.curAtk, def);
            const dmgToAtt = calcDmg(def.curAtk, att);

            // 피해 애니메이션
            try {
                const defEl = document.getElementById('enemy-field').children[targetIdx];
                const attEl = document.querySelector('#player-field .card');
                if (defEl && dmgToDef > 0 && typeof animateDamage === 'function') animateDamage(defEl, dmgToDef);
                if (attEl && dmgToAtt > 0 && typeof animateDamage === 'function') {
                    setTimeout(() => animateDamage(attEl, dmgToAtt), 100);
                }
            } catch (e) {}

            dealDamage(def, dmgToDef); dealDamage(att, dmgToAtt);

            if ((att.passives || []).includes('drain')) {
                pHP += dmgToDef;
                try { animateHPChange(document.getElementById('p-hp'), false); } catch (e) {}
            }
            if ((def.passives || []).includes('drain')) eHP += dmgToAtt;
            if ((att.passives || []).includes('bane')) def.curHp = 0;
            if ((def.passives || []).includes('bane')) att.curHp = 0;
        }
    } else {
        eHP -= att.curAtk;

        // 리더 피해 애니메이션
        try {
            const heroEl = document.getElementById('enemy-hero');
            if (heroEl && typeof animateHeroDamage === 'function') {
                animateHeroDamage(heroEl, att.curAtk);
            }
            if (typeof animateHPChange === 'function') {
                animateHPChange(document.getElementById('e-hp'), true);
            }
        } catch (e) {}

        if ((att.passives || []).includes('drain')) {
            pHP += att.curAtk;
            try {
                if (typeof animateHeal === 'function') {
                    animateHeal(document.getElementById('player-hero'), att.curAtk);
                }
                if (typeof animateHPChange === 'function') {
                    animateHPChange(document.getElementById('p-hp'), false);
                }
            } catch (e) {}
        }
    }

    resolveDeaths();
    updateView();
}

/**
 * 진화 토글
 */
function toggleEvolve() {
    if (!isPlayerTurn) return;
    const unlock = isFirst ? 5 : 4;
    if (myTurnCount < unlock || pEP <= 0 || evolvedThisTurn) return;
    isEvolveMode = !isEvolveMode;
    updateView();
}

/**
 * 진화 실행
 */
function doEvolve(idx) {
    const c = pField[idx]; if (c.evolved) return;
    pEP--; evolvedThisTurn = true; isEvolveMode = false;
    c.evolved = true; c.curAtk += 2; c.curHp += 2;
    if (!c.hasAttacked) c.canAttack = true;
    log(`${c.name} 진화!`);

    // 진화 애니메이션
    const cardEl = document.getElementById('player-field').children[idx];
    if (cardEl) animateEvolve(cardEl);

    if (c.evolve) applyEffects(c.evolve, c, null);

    setTimeout(() => updateView(), 800);
}

/**
 * 데미지 계산
 */
function calcDmg(dmg, target) {
    if ((target.passives || []).includes('barrier')) { removePassive(target, 'barrier'); return 0; }
    return dmg;
}

function dealDamage(u, v) { u.curHp -= v; }
function removePassive(u, p) { u.passives = (u.passives || []).filter(x => x !== p); }

/**
 * 사망 처리
 */
function resolveDeaths() {
    const proc = (list) => {
        for (let i = list.length - 1; i >= 0; i--) {
            if (list[i].curHp <= 0) {
                const c = list[i]; list.splice(i, 1);
                if (c.lastWords) applyEffects(c.lastWords, c, null);
            }
        }
    }
    proc(pField); proc(eField);
    if (pHP <= 0 || eHP <= 0) {
        const isWin = eHP <= 0;
        recordGameResult(isWin);
        showGameEndModal(isWin);
    }
}

/**
 * 효과 적용
 */
function applyEffects(effs, src, tgt) {
    if (!effs) return;
    effs.forEach(ef => {
        if (ef.type === 'draw') for (let i = 0; i < ef.val; i++) draw(pDeck, pHand);
        if (ef.type === 'buff') { src.curAtk += ef.atk; src.curHp += ef.hp; }
        if (ef.type === 'buff_all') pField.forEach(c => { c.curAtk += ef.atk; c.curHp += ef.hp; });
        if (ef.type === 'heal_leader') pHP += ef.val;
        if (ef.type === 'damage_leader') { if (ef.target === 'enemy') eHP -= ef.val; else pHP -= ef.val; }
        if (ef.type === 'aoe_damage') eField.forEach(c => c.curHp -= ef.val);
        if (ef.type === 'destroy_enemy') if (eField.length > 0) eField.pop();
        if (ef.type === 'destroy_all_others') { pField = [src]; eField = []; }
        if (ef.type === 'return_to_hand') if (pHand.length < 9) pHand.push(createInstance(cardsDB.find(x => x.name === src.name)));
        if (ef.type === 'summon') {
            const token = cardsDB.find(x => x.id === ef.id);
            if (pField.length < 5) pField.push(createInstance(token));
        }
    });
    resolveDeaths();
}

/**
 * 유틸리티 함수
 */
function draw(deck, hand) { if (deck.length > 0 && hand.length < 9) hand.push(deck.pop()); }
function shuffle(a) { a.sort(() => Math.random() - 0.5); }
function log(m) { const d = document.createElement('div'); d.innerText = m; document.getElementById('game-log').prepend(d); }

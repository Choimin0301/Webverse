/**
 * 애니메이션 & 시각 효과 모듈
 */

/**
 * 카드 소환 애니메이션
 */
function animateSummon(cardElement) {
    cardElement.classList.add('summoning');
    cardElement.addEventListener('animationend', () => {
        cardElement.classList.remove('summoning');
    }, { once: true });
}

/**
 * 공격 애니메이션
 */
function animateAttack(attackerEl, targetEl, isPlayerAttacking, callback) {
    if (!attackerEl || !targetEl) {
        if (callback) callback();
        return;
    }

    const attackClass = isPlayerAttacking ? 'attacking-up' : 'attacking-down';
    let callbackCalled = false;

    const executeCallback = () => {
        if (callbackCalled) return;
        callbackCalled = true;
        attackerEl.classList.remove(attackClass);
        removeAttackLine();
        if (callback) callback();
    };

    attackerEl.classList.add(attackClass);

    // 공격선 그리기
    try {
        drawAttackLine(attackerEl, targetEl);
    } catch (e) {}

    attackerEl.addEventListener('animationend', executeCallback, { once: true });

    // 폴백: 애니메이션이 실행되지 않을 경우 대비
    setTimeout(executeCallback, 500);
}

/**
 * 공격선 그리기
 */
function drawAttackLine(fromEl, toEl) {
    removeAttackLine();

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    const fromX = fromRect.left + fromRect.width / 2;
    const fromY = fromRect.top + fromRect.height / 2;
    const toX = toRect.left + toRect.width / 2;
    const toY = toRect.top + toRect.height / 2;

    const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
    const angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;

    const line = document.createElement('div');
    line.className = 'attack-line';
    line.style.left = fromX + 'px';
    line.style.top = fromY + 'px';
    line.style.width = length + 'px';
    line.style.transform = `rotate(${angle}deg)`;
    document.body.appendChild(line);
}

/**
 * 공격선 제거
 */
function removeAttackLine() {
    const existing = document.querySelector('.attack-line');
    if (existing) existing.remove();
}

/**
 * 피해 애니메이션
 */
function animateDamage(cardElement, damage) {
    cardElement.classList.add('taking-damage');
    showDamagePopup(cardElement, damage, false);

    cardElement.addEventListener('animationend', () => {
        cardElement.classList.remove('taking-damage');
    }, { once: true });
}

/**
 * 힐 애니메이션
 */
function animateHeal(element, amount) {
    showDamagePopup(element, amount, true);
}

/**
 * 피해/힐 숫자 팝업
 */
function showDamagePopup(element, value, isHeal) {
    const rect = element.getBoundingClientRect();
    const popup = document.createElement('div');
    popup.className = `damage-popup ${isHeal ? 'heal' : ''}`;
    popup.textContent = isHeal ? `+${value}` : `-${value}`;
    popup.style.left = (rect.left + rect.width / 2 - 20) + 'px';
    popup.style.top = (rect.top + rect.height / 2 - 20) + 'px';
    document.body.appendChild(popup);

    popup.addEventListener('animationend', () => {
        popup.remove();
    }, { once: true });
}

/**
 * 진화 애니메이션
 */
function animateEvolve(cardElement) {
    cardElement.classList.add('evolving');

    // 파티클 생성
    createEvolveParticles(cardElement);

    cardElement.addEventListener('animationend', () => {
        cardElement.classList.remove('evolving');
    }, { once: true });
}

/**
 * 진화 파티클 생성
 */
function createEvolveParticles(cardElement) {
    const rect = cardElement.getBoundingClientRect();
    const particleCount = 12;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'evolve-particle';

        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 80 + Math.random() * 40;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        particle.style.left = (rect.left + rect.width / 2) + 'px';
        particle.style.top = (rect.top + rect.height / 2) + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');

        document.body.appendChild(particle);

        particle.addEventListener('animationend', () => {
            particle.remove();
        }, { once: true });
    }
}

/**
 * 카드 파괴 애니메이션
 */
function animateDestroy(cardElement, callback) {
    cardElement.classList.add('destroying');

    cardElement.addEventListener('animationend', () => {
        if (callback) callback();
    }, { once: true });
}

/**
 * 리더 피해 애니메이션
 */
function animateHeroDamage(heroElement, damage) {
    heroElement.classList.add('taking-damage');
    showDamagePopup(heroElement, damage, false);

    heroElement.addEventListener('animationend', () => {
        heroElement.classList.remove('taking-damage');
    }, { once: true });
}

/**
 * HP 변화 애니메이션
 */
function animateHPChange(hpElement, isDamage) {
    hpElement.classList.add('changing', isDamage ? 'damage' : 'heal');

    setTimeout(() => {
        hpElement.classList.remove('changing', 'damage', 'heal');
    }, 300);
}

/**
 * 카드 드로우 애니메이션
 */
function animateDraw(cardElement) {
    cardElement.classList.add('drawing');

    cardElement.addEventListener('animationend', () => {
        cardElement.classList.remove('drawing');
    }, { once: true });
}

/**
 * 턴 전환 오버레이
 */
function showTurnOverlay(isPlayerTurn) {
    let overlay = document.getElementById('turn-overlay');

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'turn-overlay';
        overlay.className = 'turn-overlay';
        overlay.innerHTML = '<div class="turn-text"></div>';
        document.body.appendChild(overlay);
    }

    const textEl = overlay.querySelector('.turn-text');
    textEl.textContent = isPlayerTurn ? 'YOUR TURN' : 'ENEMY TURN';
    textEl.className = `turn-text ${isPlayerTurn ? '' : 'enemy'}`;

    overlay.classList.add('active');

    setTimeout(() => {
        overlay.classList.remove('active');
    }, 1200);
}

/**
 * 드래그 시작 시 고스트 이미지 개선
 */
function createDragGhost(originalEl) {
    const ghost = originalEl.cloneNode(true);
    ghost.className = originalEl.className + ' drag-ghost';
    ghost.style.position = 'fixed';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '99999';
    document.body.appendChild(ghost);
    return ghost;
}

/**
 * 드래그 고스트 위치 업데이트
 */
function updateDragGhost(ghost, x, y) {
    if (ghost) {
        ghost.style.left = (x - 55) + 'px';
        ghost.style.top = (y - 75) + 'px';
    }
}

/**
 * 드래그 고스트 제거
 */
function removeDragGhost(ghost) {
    if (ghost) ghost.remove();
}

/**
 * 타겟 하이라이트 강화
 */
function enhanceTargetHighlight(targetEl) {
    targetEl.classList.add('valid-target');
}

/**
 * 전투 효과 (두 카드가 충돌)
 */
function animateClash(attacker, defender, attDmg, defDmg, callback) {
    // 동시에 피해 애니메이션
    animateDamage(attacker, defDmg);
    animateDamage(defender, attDmg);

    setTimeout(() => {
        if (callback) callback();
    }, 500);
}

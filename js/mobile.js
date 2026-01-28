/**
 * 모바일 터치 지원
 */

let touchSelectedCard = null;
let touchSource = null;
let touchIdx = -1;
let isMobile = false;

/**
 * 모바일 감지
 */
function detectMobile() {
    isMobile = ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0) ||
               (window.matchMedia("(pointer: coarse)").matches);
    return isMobile;
}

/**
 * 터치 이벤트 설정
 */
function setupTouchEvents(el, source, index) {
    if (!detectMobile()) return;

    el.addEventListener('touchstart', (e) => {
        if (!isPlayerTurn) return;
        e.preventDefault();
        handleTouchSelect(el, source, index);
    }, { passive: false });
}

/**
 * 터치 선택 처리
 */
function handleTouchSelect(el, source, index) {
    // 이전 선택 해제
    clearTouchSelection();

    // 새로운 선택
    touchSelectedCard = el;
    touchSource = source;
    touchIdx = index;
    el.classList.add('touch-selected');

    // 손패에서 선택한 경우
    if (source === 'hand') {
        showHandCardOptions(el, index);
    }
    // 필드에서 선택한 경우 (공격)
    else if (source === 'field') {
        const card = pField[index];
        if (card && card.canAttack) {
            showAttackTargets(index);
        }
    }
}

/**
 * 터치 선택 해제
 */
function clearTouchSelection() {
    if (touchSelectedCard) {
        touchSelectedCard.classList.remove('touch-selected');
    }
    touchSelectedCard = null;
    touchSource = null;
    touchIdx = -1;

    // 타겟 하이라이트 제거
    document.querySelectorAll('.touch-target').forEach(el => {
        el.classList.remove('touch-target');
    });
    document.querySelectorAll('.valid-target').forEach(el => {
        el.classList.remove('valid-target');
    });

    // 옵션 UI 숨기기
    hideTouchOptions();
}

/**
 * 손패 카드 옵션 표시
 */
function showHandCardOptions(el, index) {
    const card = pHand[index];
    if (!card) return;

    let cost = card.enhance && pMana >= card.enhance.cost ? card.enhance.cost : card.cost;

    if (pMana >= cost && pField.length < 5) {
        // 플레이 가능 - 필드를 타겟으로 표시
        const playerField = document.getElementById('player-field');
        playerField.classList.add('touch-target');

        // 터치 옵션 UI 생성
        showTouchOptionUI([
            { text: '카드 내기', action: () => { playCard(index); clearTouchSelection(); } },
            { text: '취소', action: () => clearTouchSelection() }
        ]);
    } else {
        // 플레이 불가능
        showTouchOptionUI([
            { text: '마나 부족', disabled: true },
            { text: '취소', action: () => clearTouchSelection() }
        ]);
    }
}

/**
 * 공격 타겟 표시
 */
function showAttackTargets(attackerIdx) {
    const card = pField[attackerIdx];
    if (!card || !card.canAttack) return;

    const isSummon = card.summonTurn === myTurnCount;
    const storm = (card.passives || []).includes('storm');
    const rush = (card.passives || []).includes('rush');
    const warders = eField.filter(c => (c.passives || []).includes('ward') && !(c.passives || []).includes('ambush'));

    // 적 유닛 타겟
    const enemyFieldEl = document.getElementById('enemy-field');
    eField.forEach((c, i) => {
        const tps = c.passives || [];
        if (tps.includes('ambush') || tps.includes('intimidate')) return;

        if (warders.length > 0) {
            if (tps.includes('ward')) {
                enemyFieldEl.children[i]?.classList.add('valid-target');
            }
        } else {
            enemyFieldEl.children[i]?.classList.add('valid-target');
        }
    });

    // 적 리더 타겟
    if (warders.length === 0) {
        if (!isSummon || storm) {
            document.getElementById('enemy-hero')?.classList.add('valid-target');
        } else if (rush && eField.length === 0) {
            // 돌진인데 적 유닛이 없으면 공격 불가
        }
    }

    // 터치 옵션
    showTouchOptionUI([
        { text: '대상 선택', disabled: true },
        { text: '취소', action: () => clearTouchSelection() }
    ]);

    // 타겟 클릭 이벤트
    setupTouchAttackTargets(attackerIdx);
}

/**
 * 터치 공격 타겟 이벤트 설정
 */
function setupTouchAttackTargets(attackerIdx) {
    // 적 유닛 타겟
    const enemyFieldEl = document.getElementById('enemy-field');
    Array.from(enemyFieldEl.children).forEach((el, i) => {
        if (el.classList.contains('valid-target')) {
            el.addEventListener('click', function onTouchAttack() {
                attack(attackerIdx, 'unit', i);
                clearTouchSelection();
                el.removeEventListener('click', onTouchAttack);
            }, { once: true });
        }
    });

    // 적 리더 타겟
    const enemyHero = document.getElementById('enemy-hero');
    if (enemyHero?.classList.contains('valid-target')) {
        enemyHero.addEventListener('click', function onTouchHeroAttack() {
            attack(attackerIdx, 'hero', 0);
            clearTouchSelection();
            enemyHero.removeEventListener('click', onTouchHeroAttack);
        }, { once: true });
    }
}

/**
 * 터치 옵션 UI 표시
 */
function showTouchOptionUI(options) {
    hideTouchOptions();

    const ui = document.createElement('div');
    ui.id = 'touch-options';
    ui.className = 'touch-options-ui';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'touch-option-btn';
        btn.textContent = opt.text;
        if (opt.disabled) {
            btn.disabled = true;
            btn.classList.add('disabled');
        } else if (opt.action) {
            btn.onclick = opt.action;
        }
        ui.appendChild(btn);
    });

    document.body.appendChild(ui);
}

/**
 * 터치 옵션 UI 숨기기
 */
function hideTouchOptions() {
    const ui = document.getElementById('touch-options');
    if (ui) ui.remove();
}

/**
 * 필드 터치 이벤트 (카드 내기)
 */
function setupFieldTouchEvents() {
    if (!detectMobile()) return;

    const playerField = document.getElementById('player-field');
    playerField.addEventListener('click', (e) => {
        if (touchSource === 'hand' && touchIdx >= 0 && playerField.classList.contains('touch-target')) {
            playCard(touchIdx);
            clearTouchSelection();
        }
    });
}

/**
 * 배경 터치로 선택 해제
 */
function setupBackgroundTouchClear() {
    document.addEventListener('click', (e) => {
        if (!isMobile) return;

        // 카드나 UI 요소가 아닌 곳 클릭 시 선택 해제
        if (!e.target.closest('.card') &&
            !e.target.closest('.touch-options-ui') &&
            !e.target.closest('.valid-target')) {
            clearTouchSelection();
        }
    });
}

/**
 * 모바일 초기화
 */
function initMobile() {
    if (!detectMobile()) return;

    document.body.classList.add('mobile-device');
    setupFieldTouchEvents();
    setupBackgroundTouchClear();

    console.log('Mobile touch support initialized');
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initMobile);

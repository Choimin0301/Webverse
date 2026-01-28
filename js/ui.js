/**
 * 드래그 상태 관리
 */
let currentDragGhost = null;
let isDragging = false;
let heroEventInitialized = false;

/**
 * 드래그 이벤트 설정
 */
function setupDragEvents(el, source, index) {
    el.setAttribute('draggable', 'true');
    el.onmousedown = (e) => e.stopPropagation();

    el.addEventListener('dragstart', (e) => {
        if (!isPlayerTurn) { e.preventDefault(); return; }
        dragSource = source;
        draggedIdx = index;
        isDragging = true;
        e.dataTransfer.setData('text/plain', index.toString());
        e.dataTransfer.effectAllowed = 'move';

        // 기본 드래그 이미지 숨기기
        const emptyImg = new Image();
        emptyImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        e.dataTransfer.setDragImage(emptyImg, 0, 0);

        el.classList.add('dragging');

        // 커스텀 고스트 생성
        currentDragGhost = createDragGhost(el);

        if (source === 'field') {
            const card = pField[index];
            if (card && card.canAttack) {
                highlightTargets(card);
            }
        }
    });

    el.addEventListener('drag', (e) => {
        if (currentDragGhost && e.clientX > 0 && e.clientY > 0) {
            updateDragGhost(currentDragGhost, e.clientX, e.clientY);

            // 필드에서 드래그 중일 때 공격선 그리기
            if (dragSource === 'field' && draggedIdx >= 0) {
                const fromEl = document.getElementById('player-field').children[draggedIdx];
                if (fromEl) {
                    drawAttackLineToPoint(fromEl, e.clientX, e.clientY);
                }
            }
        }
    });

    el.addEventListener('dragend', () => {
        el.classList.remove('dragging');
        clearHighlights();
        removeAttackLine();

        if (currentDragGhost) {
            removeDragGhost(currentDragGhost);
            currentDragGhost = null;
        }

        isDragging = false;
        dragSource = null;
        draggedIdx = -1;
    });
}

/**
 * 특정 지점까지 공격선 그리기
 */
function drawAttackLineToPoint(fromEl, toX, toY) {
    removeAttackLine();

    const fromRect = fromEl.getBoundingClientRect();
    const fromX = fromRect.left + fromRect.width / 2;
    const fromY = fromRect.top + fromRect.height / 2;

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
 * 공격 타겟 설정 (적 하수인용)
 */
function setupAttackTarget(el, type, index) {
    el.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });
    el.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dragSource === 'field' && draggedIdx >= 0) {
            const savedIdx = draggedIdx;
            attack(savedIdx, type, index);
        }
    });
}

/**
 * 적 리더 공격 타겟 설정 (한 번만 등록)
 */
function setupHeroAttackTarget() {
    if (heroEventInitialized) return;

    const heroEl = document.getElementById('enemy-hero');
    if (!heroEl) return;

    heroEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    heroEl.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dragSource === 'field' && draggedIdx >= 0) {
            const savedIdx = draggedIdx;
            attack(savedIdx, 'hero', 0);
        }
    });

    heroEventInitialized = true;
}

/**
 * 타겟 하이라이트
 */
function highlightTargets(card) {
    const isSummon = card.summonTurn === myTurnCount;
    const storm = (card.passives || []).includes('storm');
    const warders = eField.filter(c => (c.passives || []).includes('ward') && !(c.passives || []).includes('ambush'));

    if (warders.length > 0) {
        const nodes = document.getElementById('enemy-field').children;
        eField.forEach((c, i) => {
            if ((c.passives || []).includes('ward') && !(c.passives || []).includes('ambush'))
                nodes[i].classList.add('valid-target');
        });
    } else {
        if (!isSummon || storm) document.getElementById('enemy-hero').classList.add('valid-target');
        const nodes = document.getElementById('enemy-field').children;
        eField.forEach((c, i) => {
            if (!(c.passives || []).includes('ambush') && !(c.passives || []).includes('intimidate'))
                nodes[i].classList.add('valid-target');
        });
    }
}

function clearHighlights() {
    document.querySelectorAll('.valid-target').forEach(e => e.classList.remove('valid-target'));
}

/**
 * 화면 업데이트
 */
function updateView() {
    // PP (마나) 표시 업데이트
    document.getElementById('mana-current').innerText = pMana;
    document.getElementById('mana-max').innerText = pMaxMana;

    // HP 표시 업데이트
    document.getElementById('p-hp').innerText = pHP;
    document.getElementById('e-hp').innerText = eHP;

    // EP 오브 렌더링
    renderOrbs('p-ep', pEP, isFirst ? 2 : 3);
    renderOrbs('e-ep', eEP, isFirst ? 3 : 2);

    // 덱 카운트 업데이트
    const deckCountEl = document.getElementById('deck-count');
    if (deckCountEl) deckCountEl.innerText = pDeck.length;

    // 버튼 상태 업데이트
    const evBtn = document.getElementById('btn-evolve');
    evBtn.classList.toggle('active', isEvolveMode);

    const endBtn = document.getElementById('btn-end');
    endBtn.disabled = !isPlayerTurn;

    const unlock = isFirst ? 5 : 4;
    const canEvolve = isPlayerTurn && myTurnCount >= unlock && pEP > 0 && !evolvedThisTurn;
    evBtn.disabled = !canEvolve;

    // 유도 애니메이션 처리
    updateButtonSuggestions(endBtn, evBtn, canEvolve);

    // 카드 렌더링
    renderHand(pHand, 'player-hand', true);
    renderHand(eHand, 'enemy-hand', false);
    renderField(pField, 'player-field', true);
    renderField(eField, 'enemy-field', false);
}

/**
 * 버튼 유도 애니메이션 업데이트
 */
function updateButtonSuggestions(endBtn, evBtn, canEvolve) {
    // 기본적으로 suggest 클래스 제거
    endBtn.classList.remove('suggest');
    evBtn.classList.remove('suggest');

    if (!isPlayerTurn) return;

    // 플레이 가능한 카드 확인
    const hasPlayableCard = pHand.some(card => {
        let cost = card.enhance && pMana >= card.enhance.cost ? card.enhance.cost : card.cost;
        return pMana >= cost && pField.length < 5;
    });

    // 공격 가능한 카드 확인
    const hasAttackableCard = pField.some(card => card.canAttack);

    // 진화 가능한 카드 확인
    const hasEvolvableCard = pField.some(card => !card.evolved);

    // 진화 유도: 진화 가능 턴이고, 진화 안 했고, 진화 가능한 몬스터가 있을 때
    if (canEvolve && hasEvolvableCard && !isEvolveMode) {
        evBtn.classList.add('suggest');
    }

    // 턴 종료 유도: 플레이 가능한 카드 없고, 공격 가능한 카드도 없을 때
    // (단, 진화 가능하면 진화를 먼저 유도)
    if (!hasPlayableCard && !hasAttackableCard) {
        if (canEvolve && hasEvolvableCard) {
            // 진화 유도가 우선
        } else {
            endBtn.classList.add('suggest');
        }
    }
}

/**
 * EP 오브 렌더링
 */
function renderOrbs(id, count, max) {
    const el = document.getElementById(id);
    el.innerHTML = '';
    for (let i = 0; i < max; i++) {
        const o = document.createElement('div');
        o.className = `orb ${i < count ? 'on' : ''}`;
        el.appendChild(o);
    }
}

/**
 * 카드 내부 HTML 생성
 */
function renderCardInner(c, hide) {
    if (hide) return `<div class="card enemy-card-back"><div style="width:100%;height:100%;background:linear-gradient(135deg,#222,#444);"></div></div>`;

    const passives = c.passives || [];
    let badges = '';
    if (passives.includes('ward')) badges += '<span class="keyword-icon">🛡️</span>';
    if (passives.includes('bane')) badges += '<span class="keyword-icon" style="background:#8e44ad">☠️</span>';
    if (passives.includes('storm')) badges += '<span class="keyword-icon" style="background:#2980b9">⚡</span>';
    if (passives.includes('rush')) badges += '<span class="keyword-icon" style="background:#f39c12">👟</span>';
    if (passives.includes('ambush')) badges += '<span class="keyword-icon" style="background:#555">🥷</span>';
    if (passives.includes('drain')) badges += '<span class="keyword-icon" style="background:#c0392b">🩸</span>';
    if (passives.includes('barrier')) badges += '<span class="keyword-icon" style="background:#f1c40f">🔰</span>';

    let activeEnhance = !hide && isPlayerTurn && c.enhance && pMana >= c.enhance.cost && !c.summonTurn;
    let displayCost = activeEnhance ? c.enhance.cost : c.cost;

    const artUrl = getCardArt(c.id);
    return `
        <div class="card-cost ${activeEnhance ? 'enhance-cost' : ''}">${displayCost}</div>
        <div class="icon-row">${badges}</div>
        <div class="card-art" style="background-image:url('${artUrl}')"></div>
        <div class="card-mid"><div class="card-name">${c.name}</div></div>
        <div class="card-bottom">
            <div class="card-desc">${c.desc || ''}</div>
        </div>
        <div class="stat-box stat-atk">${c.curAtk !== undefined ? c.curAtk : c.atk}</div>
        <div class="stat-box stat-hp">${c.curHp !== undefined ? c.curHp : c.hp}</div>
    `;
}

/**
 * 손패 렌더링
 */
function renderHand(list, id, isP) {
    const el = document.getElementById(id);
    el.innerHTML = '';
    list.forEach((c, i) => {
        const d = document.createElement('div');
        const p = c.passives || [];
        d.className = `card ${isP ? 'in-hand' : ''} ${p.join(' ')}`;
        d.innerHTML = renderCardInner(c, !isP);
        if (isP) {
            let cost = c.enhance && pMana >= c.enhance.cost ? c.enhance.cost : c.cost;
            if (pMana >= cost && isPlayerTurn) d.classList.add('playable');
            setupDragEvents(d, 'hand', i);
        }
        el.appendChild(d);
    });
}

/**
 * 필드 렌더링
 */
function renderField(list, id, isP) {
    const el = document.getElementById(id);
    el.innerHTML = '';
    list.forEach((c, i) => {
        const d = document.createElement('div');
        const p = c.passives || [];
        d.className = `card ${p.join(' ')} ${c.evolved ? 'evolved' : ''}`;
        d.innerHTML = renderCardInner(c, false);
        if (isP) {
            if (isEvolveMode && !c.evolved) {
                d.style.boxShadow = "0 0 15px white";
                d.onclick = () => doEvolve(i);
            }
            else if (c.canAttack && isPlayerTurn && !isEvolveMode) {
                d.classList.add('can-attack');
                setupDragEvents(d, 'field', i);
            }
            else d.classList.add('exhausted');
        } else {
            setupAttackTarget(d, 'unit', i);
        }
        el.appendChild(d);
    });
}

/**
 * 필드 드래그 이벤트 초기화
 */
function initFieldDragEvents() {
    const pFieldEl = document.getElementById('player-field');
    pFieldEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (dragSource === 'hand') pFieldEl.classList.add('drag-hover');
    });
    pFieldEl.addEventListener('dragleave', () => pFieldEl.classList.remove('drag-hover'));
    pFieldEl.addEventListener('drop', (e) => {
        e.preventDefault();
        pFieldEl.classList.remove('drag-hover');
        if (dragSource === 'hand' && draggedIdx >= 0) {
            playCard(draggedIdx);
        }
    });

    // 적 리더 공격 타겟 설정
    setupHeroAttackTarget();
}

/**
 * 게임 종료 모달 표시
 */
function showGameEndModal(isWin) {
    const stats = getStats();
    const modal = document.getElementById('game-end-modal');
    const title = document.getElementById('modal-result-title');
    const statsDiv = document.getElementById('modal-stats-content');

    title.textContent = isWin ? '승리!' : '패배...';
    title.className = `modal-title ${isWin ? 'win' : 'loss'}`;

    statsDiv.innerHTML = `
        <p>게임 턴 수: <span class="stat-highlight">${myTurnCount}</span></p>
        <p>총 전적: <span class="stat-highlight">${stats.wins}승 ${stats.losses}패</span></p>
        <p>승률: <span class="stat-highlight">${getWinRate()}%</span></p>
    `;

    modal.classList.add('active');
}

/**
 * 게임 종료 모달 닫기
 */
function closeGameEndModal() {
    document.getElementById('game-end-modal').classList.remove('active');
}

/**
 * 재시작
 */
function restartGame() {
    closeGameEndModal();
    location.reload();
}

/**
 * 전적 표시 업데이트
 */
function updateStatsDisplay() {
    const statsEl = document.getElementById('stats-display');
    if (!statsEl) return;

    const stats = getStats();
    statsEl.innerHTML = `
        <h4>전적</h4>
        <div class="stats-row">
            <div class="stat-item">
                <div class="stat-value wins">${stats.wins}</div>
                <div class="stat-label">승리</div>
            </div>
            <div class="stat-item">
                <div class="stat-value losses">${stats.losses}</div>
                <div class="stat-label">패배</div>
            </div>
            <div class="stat-item">
                <div class="stat-value rate">${getWinRate()}%</div>
                <div class="stat-label">승률</div>
            </div>
        </div>
    `;
}

/**
 * 저장된 덱 목록 렌더링
 */
function renderSavedDecksList() {
    const listEl = document.getElementById('saved-decks-list');
    if (!listEl) return;

    const decks = getSavedDecks();
    const deckNames = Object.keys(decks);

    if (deckNames.length === 0) {
        listEl.innerHTML = '<p style="padding:15px; color:#666; text-align:center;">저장된 덱이 없습니다</p>';
        return;
    }

    listEl.innerHTML = deckNames.map(name => {
        const deck = decks[name];
        const date = new Date(deck.savedAt).toLocaleDateString('ko-KR');
        const cardCount = deck.cards.reduce((a, b) => a + b.count, 0);
        return `
            <div class="saved-deck-item" onclick="loadDeckAndRender('${name}')">
                <div>
                    <div class="saved-deck-name">${name}</div>
                    <div class="saved-deck-date">${cardCount}장 | ${date}</div>
                </div>
                <button class="saved-deck-delete" onclick="event.stopPropagation(); deleteDeckAndRender('${name}')">삭제</button>
            </div>
        `;
    }).join('');
}

/**
 * 덱 불러오기 및 렌더링
 */
function loadDeckAndRender(name) {
    if (loadDeck(name)) {
        renderBuilder();
        toggleSavedDecksList();
    }
}

/**
 * 덱 삭제 및 렌더링
 */
function deleteDeckAndRender(name) {
    if (confirm(`"${name}" 덱을 삭제하시겠습니까?`)) {
        deleteDeck(name);
        renderSavedDecksList();
    }
}

/**
 * 덱 저장 UI 핸들러
 */
function handleSaveDeck() {
    const input = document.getElementById('deck-name-input');
    const name = input.value.trim();
    if (!name) {
        alert('덱 이름을 입력하세요.');
        return;
    }
    if (myDeckList.length === 0) {
        alert('저장할 덱이 없습니다.');
        return;
    }
    if (saveDeck(name)) {
        alert(`"${name}" 덱이 저장되었습니다.`);
        input.value = '';
        renderSavedDecksList();
    }
}

/**
 * 저장된 덱 목록 토글
 */
function toggleSavedDecksList() {
    const listEl = document.getElementById('saved-decks-list');
    if (listEl.style.display === 'none' || !listEl.style.display) {
        renderSavedDecksList();
        listEl.style.display = 'block';
    } else {
        listEl.style.display = 'none';
    }
}

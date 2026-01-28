/**
 * 덱 빌더 로직
 */

/**
 * 기본 덱 설정
 * 형식: { 카드ID: 장수 }
 * 여기서 원하는 기본 덱을 설정하세요
 */
const DEFAULT_DECK = {
    // 1코스트 (4장)
    1: 2,   // 고블린
    2: 2,   // 신속의 검사

    // 2코스트 (8장)
    3: 2,   // 파이터
    4: 2,   // 방패병
    7: 2,   // 견습 기사
    28: 2,  // 도적

    // 3코스트 (8장)
    9: 2,   // 치유사
    11: 2,  // 마법 기사
    30: 2,  // 화염 마법사
    31: 2,  // 숲의 수호자

    // 4코스트 (6장)
    14: 2,  // 철벽의 기사
    15: 2,  // 노장군
    35: 2,  // 번개 정령

    // 5코스트 (4장)
    18: 2,  // 검호
    19: 2,  // 처형인

    // 6코스트 (4장)
    43: 2,  // 수호천사
    44: 2,  // 염화룡

    // 고코스트 (4장)
    47: 2,  // 천벌의 천사
    23: 1,  // 제네시스
    24: 1,  // 바하무트
};

/**
 * 덱 빌더 초기화
 */
function initBuilder() {
    // DEFAULT_DECK 설정에 따라 덱 구성
    Object.entries(DEFAULT_DECK).forEach(([cardId, count]) => {
        const card = cardsDB.find(c => c.id === parseInt(cardId));
        if (card && count > 0) {
            for (let i = 0; i < count; i++) {
                addToDeckSilent(card);
            }
        }
    });
    renderBuilder();
}

/**
 * 덱에 카드 추가 (렌더링 없이)
 */
function addToDeckSilent(card) {
    let total = myDeckList.reduce((a, b) => a + b.count, 0);
    if (total >= 40) return;
    let existing = myDeckList.find(x => x.id === card.id);
    if (existing) {
        if (existing.count < 3) existing.count++;
    } else {
        myDeckList.push({ id: card.id, count: 1, data: card });
    }
}

/**
 * 덱에 카드 추가
 */
function addToDeck(card) {
    let total = myDeckList.reduce((a, b) => a + b.count, 0);
    if (total >= 40) return;
    let existing = myDeckList.find(x => x.id === card.id);
    if (existing) {
        if (existing.count < 3) existing.count++;
    }
    else myDeckList.push({ id: card.id, count: 1, data: card });
    renderBuilder();
}

/**
 * 덱에서 카드 제거
 */
function removeFromDeck(id) {
    let idx = myDeckList.findIndex(x => x.id === id);
    if (idx >= 0) {
        myDeckList[idx].count--;
        if (myDeckList[idx].count <= 0) myDeckList.splice(idx, 1);
        renderBuilder();
    }
}

/**
 * 덱 빌더 렌더링
 */
function renderBuilder() {
    const pool = document.getElementById('builder-pool');
    const list = document.getElementById('builder-list');
    pool.innerHTML = '';
    list.innerHTML = '';

    cardsDB.filter(c => c.id !== 99).forEach(c => {
        const inDeck = myDeckList.find(x => x.id === c.id);
        const count = inDeck ? inDeck.count : 0;
        const isMaxed = count >= 3;

        const div = document.createElement('div');
        div.className = `card ${isMaxed ? 'maxed-out' : ''}`;

        let inner = renderCardInner(c, false);

        // 배지 & 안내문구 처리
        if (count > 0) {
            inner += `<div class="pool-count-badge">x${count}</div>`;
        }
        if (isMaxed) {
            inner += `<div class="max-overlay-text">이미 최대 장수로<br>포함되었습니다</div>`;
            div.onclick = null;
        } else {
            div.onclick = () => addToDeck(c);
        }

        div.innerHTML = inner;
        pool.appendChild(div);
    });

    let total = 0;
    myDeckList.sort((a, b) => a.data.cost - b.data.cost).forEach(item => {
        total += item.count;
        const div = document.createElement('div');
        div.className = 'deck-item';
        div.innerHTML = `
            <div class="deck-item-left">
                <div class="list-cost">${item.data.cost}</div>
                <div class="list-name">${item.data.name}</div>
            </div>
            <div class="list-count">x${item.count}</div>
        `;
        div.onclick = () => removeFromDeck(item.id);
        list.appendChild(div);
    });

    document.getElementById('deck-count-display').innerText = `${total} / 40`;
    document.getElementById('btn-finish-deck').disabled = (total < 30);
}

/**
 * 게임 시작 화면으로 전환
 */
function toStartScreen() {
    document.getElementById('deck-builder-screen').style.display = 'none';
    document.getElementById('start-overlay').style.display = 'flex';
}

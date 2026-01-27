/**
 * 덱 빌더 로직
 */

/**
 * 덱 빌더 초기화
 */
function initBuilder() {
    // 기본 덱 구성 (처음 10장 카드 각 3장씩)
    for (let i = 0; i < 10; i++) {
        addToDeck(cardsDB[i]);
        addToDeck(cardsDB[i]);
        addToDeck(cardsDB[i]);
    }
    renderBuilder();
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

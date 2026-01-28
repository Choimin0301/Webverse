/**
 * 데이터 저장/불러오기 (localStorage)
 */

const STORAGE_KEYS = {
    DECKS: 'webverse_decks',
    CURRENT_DECK: 'webverse_current_deck',
    STATS: 'webverse_stats'
};

/**
 * 덱 저장
 */
function saveDeck(deckName) {
    if (!deckName || myDeckList.length === 0) return false;

    const decks = getSavedDecks();
    decks[deckName] = {
        name: deckName,
        cards: myDeckList.map(item => ({ id: item.id, count: item.count })),
        savedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
    return true;
}

/**
 * 저장된 덱 목록 가져오기
 */
function getSavedDecks() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.DECKS)) || {};
    } catch {
        return {};
    }
}

/**
 * 덱 불러오기
 */
function loadDeck(deckName) {
    const decks = getSavedDecks();
    const deck = decks[deckName];

    if (!deck) return false;

    myDeckList = [];
    deck.cards.forEach(item => {
        const cardData = cardsDB.find(c => c.id === item.id);
        if (cardData) {
            myDeckList.push({ id: item.id, count: item.count, data: cardData });
        }
    });

    renderBuilder();
    return true;
}

/**
 * 덱 삭제
 */
function deleteDeck(deckName) {
    const decks = getSavedDecks();
    delete decks[deckName];
    localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
}

/**
 * 현재 덱 자동 저장 (게임 시작 전)
 */
function saveCurrentDeck() {
    const deckData = myDeckList.map(item => ({ id: item.id, count: item.count }));
    localStorage.setItem(STORAGE_KEYS.CURRENT_DECK, JSON.stringify(deckData));
}

/**
 * 마지막 덱 자동 불러오기
 */
function loadLastDeck() {
    try {
        const deckData = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_DECK));
        if (!deckData || deckData.length === 0) return false;

        myDeckList = [];
        deckData.forEach(item => {
            const cardData = cardsDB.find(c => c.id === item.id);
            if (cardData) {
                myDeckList.push({ id: item.id, count: item.count, data: cardData });
            }
        });
        return true;
    } catch {
        return false;
    }
}

/**
 * 전적 가져오기
 */
function getStats() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS)) || {
            wins: 0,
            losses: 0,
            totalGames: 0,
            history: []
        };
    } catch {
        return { wins: 0, losses: 0, totalGames: 0, history: [] };
    }
}

/**
 * 전적 기록
 */
function recordGameResult(isWin) {
    const stats = getStats();

    stats.totalGames++;
    if (isWin) stats.wins++;
    else stats.losses++;

    // 최근 20게임 기록 유지
    stats.history.unshift({
        result: isWin ? 'win' : 'loss',
        date: new Date().toISOString(),
        turns: myTurnCount
    });
    if (stats.history.length > 20) stats.history.pop();

    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    return stats;
}

/**
 * 전적 초기화
 */
function resetStats() {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify({
        wins: 0,
        losses: 0,
        totalGames: 0,
        history: []
    }));
}

/**
 * 승률 계산
 */
function getWinRate() {
    const stats = getStats();
    if (stats.totalGames === 0) return 0;
    return Math.round((stats.wins / stats.totalGames) * 100);
}

/**
 * 모든 저장 데이터 초기화
 */
function resetAllData() {
    if (confirm('모든 저장 데이터(덱, 전적)를 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
        localStorage.removeItem(STORAGE_KEYS.DECKS);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_DECK);
        localStorage.removeItem(STORAGE_KEYS.STATS);

        // 덱 리스트 초기화 후 기본 덱으로
        myDeckList = [];
        initBuilder();
        updateStatsDisplay();
        renderSavedDecksList();

        alert('모든 데이터가 초기화되었습니다.');
    }
}

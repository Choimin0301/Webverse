/**
 * 카드 데이터베이스
 * 이미지: images/cards/{id}.png 파일을 넣으면 자동 적용
 */
const CARD_IMG_PATH = 'images/cards/';

const cardsDB = [
    // 1코스트 (4장)
    { id: 1, cost: 1, atk: 1, hp: 2, name: "고블린", desc: "바닐라" },
    { id: 2, cost: 1, atk: 1, hp: 1, name: "신속의 검사", desc: "질주", passives: ['storm'] },
    { id: 25, cost: 1, atk: 2, hp: 1, name: "광전사", desc: "바닐라" },
    { id: 26, cost: 1, atk: 1, hp: 1, name: "요정", desc: "출격: 1장 드로우", fanfare: [{type:'draw', val:1}] },

    // 2코스트 (8장)
    { id: 3, cost: 2, atk: 2, hp: 2, name: "파이터", desc: "바닐라" },
    { id: 4, cost: 2, atk: 1, hp: 3, name: "방패병", desc: "수호", passives: ['ward'] },
    { id: 5, cost: 2, atk: 2, hp: 1, name: "닌자", desc: "잠복", passives: ['ambush'] },
    { id: 6, cost: 2, atk: 1, hp: 1, name: "독사", desc: "필살", passives: ['bane'] },
    { id: 7, cost: 2, atk: 2, hp: 2, name: "견습 기사", desc: "출격: 1장 드로우", fanfare: [{type:'draw', val:1}] },
    { id: 8, cost: 2, atk: 2, hp: 2, name: "용의 전령", desc: "증강(4): +2/+2", enhance: {cost:4, effects:[{type:'buff', atk:2, hp:2}]} },
    { id: 27, cost: 2, atk: 2, hp: 2, name: "성기사 견습생", desc: "수호", passives: ['ward'] },
    { id: 28, cost: 2, atk: 3, hp: 1, name: "도적", desc: "돌진", passives: ['rush'] },

    // 3코스트 (10장)
    { id: 9, cost: 3, atk: 2, hp: 3, name: "치유사", desc: "출격: 리더 2 회복", fanfare: [{type:'heal_leader', val:2}] },
    { id: 10, cost: 3, atk: 3, hp: 2, name: "창술사", desc: "공격시: +1/+0", strike: [{type:'buff', atk:1, hp:0}] },
    { id: 11, cost: 3, atk: 2, hp: 2, name: "마법 기사", desc: "질주", passives: ['storm'] },
    { id: 12, cost: 3, atk: 1, hp: 4, name: "유령", desc: "위압", passives: ['intimidate'] },
    { id: 13, cost: 3, atk: 1, hp: 1, name: "해골 소환사", desc: "유언: 해골 소환", lastWords: [{type:'summon', id: 99}] },
    { id: 29, cost: 3, atk: 3, hp: 3, name: "엘프 궁수", desc: "바닐라" },
    { id: 30, cost: 3, atk: 2, hp: 2, name: "화염 마법사", desc: "출격: 적 전체 1 피해", fanfare: [{type:'aoe_damage', val:1}] },
    { id: 31, cost: 3, atk: 2, hp: 4, name: "숲의 수호자", desc: "수호", passives: ['ward'] },
    { id: 32, cost: 3, atk: 4, hp: 2, name: "암살자", desc: "잠복, 필살", passives: ['ambush', 'bane'] },
    { id: 33, cost: 3, atk: 2, hp: 3, name: "성직자", desc: "출격: 리더 3 회복", fanfare: [{type:'heal_leader', val:3}] },

    // 4코스트 (8장)
    { id: 14, cost: 4, atk: 3, hp: 4, name: "철벽의 기사", desc: "수호, 배리어", passives: ['ward', 'barrier'] },
    { id: 15, cost: 4, atk: 4, hp: 3, name: "노장군", desc: "진화시: 전체 +1/+1", evolve: [{type:'buff_all', atk:1, hp:1}] },
    { id: 16, cost: 4, atk: 2, hp: 2, name: "불사조", desc: "돌진. 유언: 패로 복귀", passives:['rush'], lastWords: [{type:'return_to_hand'}] },
    { id: 17, cost: 4, atk: 2, hp: 5, name: "흡혈귀", desc: "필살, 흡혈", passives: ['bane', 'drain'] },
    { id: 34, cost: 4, atk: 4, hp: 4, name: "드워프 전사", desc: "바닐라" },
    { id: 35, cost: 4, atk: 3, hp: 3, name: "번개 정령", desc: "질주", passives: ['storm'] },
    { id: 36, cost: 4, atk: 2, hp: 5, name: "고대 골렘", desc: "수호", passives: ['ward'] },
    { id: 37, cost: 4, atk: 5, hp: 3, name: "광폭 오크", desc: "돌진", passives: ['rush'] },

    // 5코스트 (6장)
    { id: 18, cost: 5, atk: 4, hp: 5, name: "검호", desc: "교전시: 적 전체 1 피해", clash: [{type:'aoe_damage', val:1}] },
    { id: 19, cost: 5, atk: 3, hp: 3, name: "처형인", desc: "출격: 적 하나 파괴", fanfare: [{type:'destroy_enemy'}] },
    { id: 38, cost: 5, atk: 5, hp: 5, name: "거인", desc: "바닐라" },
    { id: 39, cost: 5, atk: 4, hp: 4, name: "빛의 기사", desc: "수호, 배리어", passives: ['ward', 'barrier'] },
    { id: 40, cost: 5, atk: 3, hp: 4, name: "네크로맨서", desc: "출격: 해골 2체 소환", fanfare: [{type:'summon', id: 99}, {type:'summon', id: 99}] },
    { id: 41, cost: 5, atk: 4, hp: 3, name: "폭풍의 드래곤", desc: "질주", passives: ['storm'] },

    // 6코스트 (6장)
    { id: 20, cost: 6, atk: 5, hp: 6, name: "용", desc: "오라", passives: ['aura'] },
    { id: 21, cost: 6, atk: 4, hp: 4, name: "흑마법사", desc: "증강(9): 적 리더 5 피해", enhance: {cost:9, effects:[{type:'damage_leader', val:5, target:'enemy'}]} },
    { id: 42, cost: 6, atk: 6, hp: 6, name: "타이탄", desc: "바닐라" },
    { id: 43, cost: 6, atk: 4, hp: 6, name: "수호천사", desc: "수호, 흡혈", passives: ['ward', 'drain'] },
    { id: 44, cost: 6, atk: 5, hp: 4, name: "염화룡", desc: "출격: 적 전체 2 피해", fanfare: [{type:'aoe_damage', val:2}] },
    { id: 45, cost: 6, atk: 3, hp: 3, name: "사령술사", desc: "출격: 2장 드로우", fanfare: [{type:'draw', val:2}] },

    // 7코스트 (4장)
    { id: 22, cost: 7, atk: 5, hp: 5, name: "대천사", desc: "수호, 흡혈, 오라", passives: ['ward', 'drain', 'aura'] },
    { id: 46, cost: 7, atk: 6, hp: 7, name: "에인션트 드래곤", desc: "수호", passives: ['ward'] },
    { id: 47, cost: 7, atk: 5, hp: 5, name: "천벌의 천사", desc: "출격: 적 전체 3 피해", fanfare: [{type:'aoe_damage', val:3}] },
    { id: 48, cost: 7, atk: 7, hp: 5, name: "파멸의 기사", desc: "돌진, 필살", passives: ['rush', 'bane'] },

    // 8코스트 이상 (4장)
    { id: 23, cost: 8, atk: 7, hp: 7, name: "제네시스", desc: "질주", passives: ['storm'] },
    { id: 49, cost: 8, atk: 6, hp: 8, name: "월드 트리", desc: "수호. 출격: 리더 5 회복", passives: ['ward'], fanfare: [{type:'heal_leader', val:5}] },
    { id: 50, cost: 9, atk: 8, hp: 8, name: "루시퍼", desc: "출격: 적 리더 4 피해", fanfare: [{type:'damage_leader', val:4, target:'enemy'}] },
    { id: 24, cost: 10, atk: 10, hp: 10, name: "바하무트", desc: "출격: 모든 추종자 파괴", fanfare: [{type:'destroy_all_others'}] },

    // 토큰
    { id: 99, cost: 1, atk: 1, hp: 1, name: "해골", desc: "토큰" }
];

// 카드 이미지 경로 반환 함수
function getCardArt(cardId) {
    return `${CARD_IMG_PATH}${cardId}.png`;
}

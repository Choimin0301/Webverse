/**
 * 카드 데이터베이스
 * 이미지: images/cards/{id}.png 파일을 넣으면 자동 적용
 */
const CARD_IMG_PATH = 'images/cards/';

const cardsDB = [
    { id: 1, cost: 1, atk: 1, hp: 2, name: "고블린", desc: "바닐라" },
    { id: 2, cost: 1, atk: 1, hp: 1, name: "신속의 검사", desc: "질주", passives: ['storm'] },
    { id: 3, cost: 2, atk: 2, hp: 2, name: "파이터", desc: "바닐라" },
    { id: 4, cost: 2, atk: 1, hp: 3, name: "방패병", desc: "수호", passives: ['ward'] },
    { id: 5, cost: 2, atk: 2, hp: 1, name: "닌자", desc: "잠복", passives: ['ambush'] },
    { id: 6, cost: 2, atk: 1, hp: 1, name: "독사", desc: "필살", passives: ['bane'] },
    { id: 7, cost: 2, atk: 2, hp: 2, name: "견습 기사", desc: "출격: 1장 드로우", fanfare: [{type:'draw', val:1}] },
    { id: 8, cost: 2, atk: 2, hp: 2, name: "용의 전령", desc: "출격: 증강(4) +2/+2", enhance: {cost:4, effects:[{type:'buff', atk:2, hp:2}]} },
    { id: 9, cost: 3, atk: 2, hp: 3, name: "치유사", desc: "출격: 리더 2 회복", fanfare: [{type:'heal_leader', val:2}] },
    { id: 10, cost: 3, atk: 3, hp: 2, name: "창술사", desc: "공격시: 이 추종자 +1/+0", strike: [{type:'buff', atk:1, hp:0}] },
    { id: 11, cost: 3, atk: 2, hp: 2, name: "마법 기사", desc: "질주", passives: ['storm'] },
    { id: 12, cost: 3, atk: 1, hp: 4, name: "유령", desc: "위압 (공격받지 않음)", passives: ['intimidate'] },
    { id: 13, cost: 3, atk: 1, hp: 1, name: "해골 소환사", desc: "유언: 해골(1/1) 소환", lastWords: [{type:'summon', id: 99}] },
    { id: 14, cost: 4, atk: 3, hp: 4, name: "철벽의 기사", desc: "수호, 배리어", passives: ['ward', 'barrier'] },
    { id: 15, cost: 4, atk: 4, hp: 3, name: "노장군", desc: "진화시: 내 필드 전체 +1/+1", evolve: [{type:'buff_all', atk:1, hp:1}] },
    { id: 16, cost: 4, atk: 2, hp: 2, name: "불사조", desc: "돌진. 유언: 패로 돌아옴", passives:['rush'], lastWords: [{type:'return_to_hand'}] },
    { id: 17, cost: 4, atk: 2, hp: 5, name: "흡혈귀", desc: "필살, 흡혈", passives: ['bane', 'drain'] },
    { id: 18, cost: 5, atk: 4, hp: 5, name: "검호", desc: "교전시: 적 전체 1 피해", clash: [{type:'aoe_damage', val:1}] },
    { id: 19, cost: 5, atk: 3, hp: 3, name: "처형인", desc: "출격: 적 추종자 하나 파괴", fanfare: [{type:'destroy_enemy'}] },
    { id: 20, cost: 6, atk: 5, hp: 6, name: "용", desc: "오라 (능력 대상 안됨)", passives: ['aura'] },
    { id: 21, cost: 6, atk: 4, hp: 4, name: "흑마법사", desc: "출격: 증강(9) 적 리더 5 피해", enhance: {cost:9, effects:[{type:'damage_leader', val:5, target:'enemy'}]} },
    { id: 22, cost: 7, atk: 5, hp: 5, name: "대천사", desc: "수호, 흡혈, 오라", passives: ['ward', 'drain', 'aura'] },
    { id: 23, cost: 8, atk: 7, hp: 7, name: "제네시스", desc: "질주", passives: ['storm'] },
    { id: 24, cost: 10, atk: 10, hp: 10, name: "바하무트", desc: "출격: 다른 모든 추종자 파괴", fanfare: [{type:'destroy_all_others'}] },
    { id: 99, cost: 1, atk: 1, hp: 1, name: "해골", desc: "토큰" }
];

// 카드 이미지 경로 반환 함수
function getCardArt(cardId) {
    return `${CARD_IMG_PATH}${cardId}.png`;
}

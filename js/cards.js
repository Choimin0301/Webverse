/**
 * 카드 데이터베이스
 * 이미지: images/cards/{id}.png 파일을 넣으면 자동 적용
 */
const CARD_IMG_PATH = 'images/cards/';

const cardsDB = [
    // 1코스트 (4장)
    { id: 1, cost: 1, atk: 1, hp: 2, name: "멸치", desc: "바닐라" },
    { id: 2, cost: 1, atk: 1, hp: 1, name: "밴댕이", desc: "질주", passives: ['storm'] },
    { id: 25, cost: 1, atk: 2, hp: 1, name: "서대", desc: "바닐라" },
    { id: 26, cost: 1, atk: 1, hp: 1, name: "붕어", desc: "출격: 1장 드로우", fanfare: [{type:'draw', val:1}] },

    // 2코스트 (8장)
    { id: 3, cost: 2, atk: 2, hp: 2, name: "정어리", desc: "바닐라" },
    { id: 4, cost: 2, atk: 1, hp: 3, name: "전어", desc: "수호", passives: ['ward'] },
    { id: 5, cost: 2, atk: 2, hp: 1, name: "청어", desc: "잠복", passives: ['ambush'] },
    { id: 6, cost: 2, atk: 1, hp: 1, name: "준치", desc: "필살", passives: ['bane'] },
    { id: 7, cost: 2, atk: 2, hp: 2, name: "도루묵", desc: "출격: 1장 드로우", fanfare: [{type:'draw', val:1}] },
    { id: 8, cost: 2, atk: 2, hp: 2, name: "고등어", desc: "증강(4): +2/+2", enhance: {cost:4, effects:[{type:'buff', atk:2, hp:2}]} },
    { id: 27, cost: 2, atk: 2, hp: 2, name: "잉어", desc: "수호", passives: ['ward'] },
    { id: 28, cost: 2, atk: 3, hp: 1, name: "미꾸라지", desc: "돌진", passives: ['rush'] },

    // 3코스트 (10장)
    { id: 9, cost: 3, atk: 2, hp: 3, name: "꽁치", desc: "출격: 리더 2 회복", fanfare: [{type:'heal_leader', val:2}] },
    { id: 10, cost: 3, atk: 3, hp: 2, name: "날치", desc: "공격시: +1/+0", strike: [{type:'buff', atk:1, hp:0}] },
    { id: 11, cost: 3, atk: 2, hp: 2, name: "전갱이", desc: "질주", passives: ['storm'] },
    { id: 12, cost: 3, atk: 1, hp: 4, name: "삼치", desc: "위압", passives: ['intimidate'] },
    { id: 13, cost: 3, atk: 1, hp: 1, name: "방어", desc: "유언: 멸치 소환", lastWords: [{type:'summon', id: 99}] },
    { id: 29, cost: 3, atk: 3, hp: 3, name: "메기", desc: "바닐라" },
    { id: 30, cost: 3, atk: 2, hp: 2, name: "연어", desc: "출격: 적 전체 1 피해", fanfare: [{type:'aoe_damage', val:1}] },
    { id: 31, cost: 3, atk: 2, hp: 4, name: "송어", desc: "수호", passives: ['ward'] },
    { id: 32, cost: 3, atk: 4, hp: 2, name: "명태", desc: "잠복, 필살", passives: ['ambush', 'bane'] },
    { id: 33, cost: 3, atk: 2, hp: 3, name: "임연수어", desc: "출격: 리더 3 회복", fanfare: [{type:'heal_leader', val:3}] },

    // 4코스트 (8장)
    { id: 14, cost: 4, atk: 3, hp: 4, name: "참조기", desc: "수호, 배리어", passives: ['ward', 'barrier'] },
    { id: 15, cost: 4, atk: 4, hp: 3, name: "숭어", desc: "진화시: 전체 +1/+1", evolve: [{type:'buff_all', atk:1, hp:1}] },
    { id: 16, cost: 4, atk: 2, hp: 2, name: "병어", desc: "돌진. 유언: 패로 복귀", passives:['rush'], lastWords: [{type:'return_to_hand'}] },
    { id: 17, cost: 4, atk: 2, hp: 5, name: "농어", desc: "필살, 흡혈", passives: ['bane', 'drain'] },
    { id: 34, cost: 4, atk: 4, hp: 4, name: "장어", desc: "바닐라" },
    { id: 35, cost: 4, atk: 3, hp: 3, name: "갈치", desc: "질주", passives: ['storm'] },
    { id: 36, cost: 4, atk: 2, hp: 5, name: "아귀", desc: "수호", passives: ['ward'] },
    { id: 37, cost: 4, atk: 5, hp: 3, name: "쏠배감펭", desc: "돌진", passives: ['rush'] },

    // 5코스트 (6장)
    { id: 18, cost: 5, atk: 4, hp: 5, name: "참치", desc: "교전시: 적 전체 1 피해", clash: [{type:'aoe_damage', val:1}] },
    { id: 19, cost: 5, atk: 3, hp: 3, name: "돌돔", desc: "출격: 적 하나 파괴", fanfare: [{type:'destroy_enemy'}] },
    { id: 38, cost: 5, atk: 5, hp: 5, name: "쏨뱅이", desc: "바닐라" },
    { id: 39, cost: 5, atk: 4, hp: 4, name: "우럭", desc: "수호, 배리어", passives: ['ward', 'barrier'] },
    { id: 40, cost: 5, atk: 3, hp: 4, name: "복어", desc: "출격: 멸치 2체 소환", fanfare: [{type:'summon', id: 99}, {type:'summon', id: 99}] },
    { id: 41, cost: 5, atk: 4, hp: 3, name: "상어", desc: "질주", passives: ['storm'] },

    // 6코스트 (6장)
    { id: 20, cost: 6, atk: 5, hp: 6, name: "참돔", desc: "오라", passives: ['aura'] },
    { id: 21, cost: 6, atk: 4, hp: 4, name: "청새치", desc: "증강(9): 적 리더 5 피해", enhance: {cost:9, effects:[{type:'damage_leader', val:5, target:'enemy'}]} },
    { id: 42, cost: 6, atk: 6, hp: 6, name: "철갑상어", desc: "바닐라" },
    { id: 43, cost: 6, atk: 4, hp: 6, name: "산갈치", desc: "수호, 흡혈", passives: ['ward', 'drain'] },
    { id: 44, cost: 6, atk: 5, hp: 4, name: "대게", desc: "출격: 적 전체 2 피해", fanfare: [{type:'aoe_damage', val:2}] },
    { id: 45, cost: 6, atk: 3, hp: 3, name: "홍게", desc: "출격: 2장 드로우", fanfare: [{type:'draw', val:2}] },

    // 7코스트 (4장)
    { id: 22, cost: 7, atk: 5, hp: 5, name: "물치다래", desc: "수호, 흡혈, 오라", passives: ['ward', 'drain', 'aura'] },
    { id: 46, cost: 7, atk: 6, hp: 7, name: "킹크랩", desc: "수호", passives: ['ward'] },
    { id: 47, cost: 7, atk: 5, hp: 5, name: "바닷가재", desc: "출격: 적 전체 3 피해", fanfare: [{type:'aoe_damage', val:3}] },
    { id: 48, cost: 7, atk: 7, hp: 5, name: "딱새우", desc: "돌진, 필살", passives: ['rush', 'bane'] },

    // 8코스트 이상 (4장)
    { id: 23, cost: 8, atk: 7, hp: 7, name: "가자미", desc: "질주", passives: ['storm'] },
    { id: 49, cost: 8, atk: 6, hp: 8, name: "새우", desc: "수호. 출격: 리더 5 회복", passives: ['ward'], fanfare: [{type:'heal_leader', val:5}] },
    { id: 50, cost: 9, atk: 8, hp: 8, name: "문어", desc: "출격: 적 리더 4 피해", fanfare: [{type:'damage_leader', val:4, target:'enemy'}] },
    { id: 24, cost: 10, atk: 10, hp: 10, name: "넙치", desc: "출격: 모든 추종자 파괴", fanfare: [{type:'destroy_all_others'}] },

    // ===== 추가 카드 (51~90) =====

    // 1코스트 (2장)
    { id: 51, cost: 1, atk: 1, hp: 1, name: "낙지", desc: "필살", passives: ['bane'] },
    { id: 57, cost: 1, atk: 1, hp: 2, name: "꼬막", desc: "수호", passives: ['ward'] },

    // 2코스트 (6장)
    { id: 52, cost: 2, atk: 2, hp: 2, name: "주꾸미", desc: "출격: 적 하나에 1 피해", fanfare: [{type:'damage_enemy', val:1}] },
    { id: 53, cost: 2, atk: 3, hp: 2, name: "오징어", desc: "바닐라" },
    { id: 55, cost: 2, atk: 1, hp: 3, name: "굴", desc: "흡혈", passives: ['drain'] },
    { id: 91, cost: 2, atk: 2, hp: 1, name: "낚시꾼", desc: "질주", passives: ['storm'] },
    { id: 59, cost: 2, atk: 1, hp: 2, name: "골뱅이", desc: "유언: 1장 드로우", lastWords: [{type:'draw', val:1}] },
    { id: 64, cost: 2, atk: 2, hp: 2, name: "해파리", desc: "증강(5): +3/+3", enhance: {cost:5, effects:[{type:'buff', atk:3, hp:3}]} },

    // 3코스트 (6장)
    { id: 54, cost: 3, atk: 2, hp: 4, name: "전복", desc: "배리어", passives: ['barrier'] },
    { id: 56, cost: 3, atk: 3, hp: 3, name: "가리비", desc: "출격: 1장 드로우", fanfare: [{type:'draw', val:1}] },
    { id: 58, cost: 3, atk: 2, hp: 3, name: "홍합", desc: "수호, 흡혈", passives: ['ward', 'drain'] },
    { id: 61, cost: 3, atk: 3, hp: 2, name: "성게", desc: "필살, 돌진", passives: ['bane', 'rush'] },
    { id: 63, cost: 3, atk: 1, hp: 5, name: "해삼", desc: "수호. 출격: 리더 2 회복", passives: ['ward'], fanfare: [{type:'heal_leader', val:2}] },
    { id: 70, cost: 3, atk: 2, hp: 2, name: "바다나리", desc: "유언: 멸치 2체 소환", lastWords: [{type:'summon', id: 99}, {type:'summon', id: 99}] },

    // 4코스트 (6장)
    { id: 60, cost: 4, atk: 4, hp: 3, name: "고둥", desc: "잠복", passives: ['ambush'] },
    { id: 65, cost: 4, atk: 3, hp: 4, name: "소라게", desc: "수호, 배리어", passives: ['ward', 'barrier'] },
    { id: 66, cost: 4, atk: 4, hp: 4, name: "투구게", desc: "돌진", passives: ['rush'] },
    { id: 71, cost: 4, atk: 2, hp: 3, name: "클리오네", desc: "질주, 흡혈", passives: ['storm', 'drain'] },
    { id: 72, cost: 4, atk: 3, hp: 5, name: "범피", desc: "위압", passives: ['intimidate'] },
    { id: 85, cost: 4, atk: 4, hp: 3, name: "개복치", desc: "출격: 2장 드로우", fanfare: [{type:'draw', val:2}] },

    // 5코스트 (6장)
    { id: 62, cost: 5, atk: 5, hp: 4, name: "멋쟁이성게", desc: "필살, 배리어", passives: ['bane', 'barrier'] },
    { id: 67, cost: 5, atk: 4, hp: 5, name: "삼엽충", desc: "수호. 공격시: +1/+0", passives: ['ward'], strike: [{type:'buff', atk:1, hp:0}] },
    { id: 68, cost: 5, atk: 3, hp: 4, name: "우무문어", desc: "출격: 적 전체 2 피해", fanfare: [{type:'aoe_damage', val:2}] },
    { id: 73, cost: 5, atk: 4, hp: 4, name: "블롭피쉬", desc: "흡혈, 돌진", passives: ['drain', 'rush'] },
    { id: 75, cost: 5, atk: 3, hp: 6, name: "해면", desc: "수호, 흡혈", passives: ['ward', 'drain'] },
    { id: 88, cost: 5, atk: 5, hp: 3, name: "유리병편지", desc: "출격: 2장 드로우", fanfare: [{type:'draw', val:2}] },

    // 6코스트 (4장)
    { id: 69, cost: 6, atk: 5, hp: 5, name: "해밀턴", desc: "질주, 흡혈", passives: ['storm', 'drain'] },
    { id: 74, cost: 6, atk: 6, hp: 5, name: "마루스 오르토칸나", desc: "돌진, 필살", passives: ['rush', 'bane'] },
    { id: 76, cost: 6, atk: 4, hp: 7, name: "스티기오메두사", desc: "수호, 오라", passives: ['ward', 'aura'] },
    { id: 86, cost: 6, atk: 3, hp: 3, name: "사카밤바스피스", desc: "출격: 적 하나 파괴. 유언: 1장 드로우", fanfare: [{type:'destroy_enemy'}], lastWords: [{type:'draw', val:1}] },

    // 7코스트 (4장)
    { id: 77, cost: 7, atk: 6, hp: 6, name: "범고래", desc: "질주", passives: ['storm'] },
    { id: 78, cost: 7, atk: 5, hp: 6, name: "돌고래", desc: "출격: 적 전체 3 피해. 돌진", passives: ['rush'], fanfare: [{type:'aoe_damage', val:3}] },
    { id: 80, cost: 7, atk: 4, hp: 7, name: "상괭이", desc: "수호, 배리어, 흡혈", passives: ['ward', 'barrier', 'drain'] },
    { id: 89, cost: 7, atk: 5, hp: 5, name: "팥붕어빵", desc: "출격: 리더 5 회복. 수호", passives: ['ward'], fanfare: [{type:'heal_leader', val:5}] },

    // 8코스트 이상 (6장)
    { id: 79, cost: 8, atk: 7, hp: 7, name: "벨루가", desc: "수호, 오라", passives: ['ward', 'aura'] },
    { id: 81, cost: 8, atk: 6, hp: 6, name: "일각고래", desc: "질주, 필살", passives: ['storm', 'bane'] },
    { id: 82, cost: 9, atk: 8, hp: 9, name: "향유고래", desc: "수호, 흡혈, 오라", passives: ['ward', 'drain', 'aura'] },
    { id: 83, cost: 9, atk: 7, hp: 7, name: "북극고래", desc: "출격: 적 전체 4 피해", fanfare: [{type:'aoe_damage', val:4}] },
    { id: 84, cost: 10, atk: 10, hp: 10, name: "대왕고래", desc: "질주, 흡혈", passives: ['storm', 'drain'] },
    { id: 87, cost: 10, atk: 8, hp: 8, name: "궲둞쉞렖", desc: "출격: 모든 추종자 파괴. 질주", passives: ['storm'], fanfare: [{type:'destroy_all_others'}] },
    { id: 90, cost: 8, atk: 6, hp: 6, name: "붕어빵", desc: "출격: 멸치 3체 소환", fanfare: [{type:'summon', id: 99}, {type:'summon', id: 99}, {type:'summon', id: 99}] },
    
    // 토큰
    { id: 99, cost: 1, atk: 1, hp: 1, name: "멸치", desc: "토큰" }
];

// 카드 이미지 경로 반환 함수
function getCardArt(cardId) {
    return `${CARD_IMG_PATH}${cardId}.png`;
}

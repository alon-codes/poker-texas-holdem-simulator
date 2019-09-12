import GameCombinations from '../Consts/GameCombinations';

export default {
    rankCompare: (rank1, rank2, p1, p2) => {
        if(rank1 === rank2){
            return null;
        }
        if(rank1 > rank2){
            return p2;
        } else {
            return p1;
        }
    },
    [GameCombinations.HIGH_CARD]: (p1, p2) => {
        const rank1 = p1.resultSet.highCard.rank.get();
        const rank2 = p2.resultSet.highCard.rank.get();
        return this.rankCompare(rank1,rank2, p1, p2);
    },
    [GameCombinations.ONE_PAIR]: (p1, p2) => {
        const rank1 = p1.resultSet.highestPair.rank.get();
        const rank2 = p2.resultSet.highestPair.rank.get();
        return this.rankCompare(rank1,rank2, p1, p2);
    },
    [GameCombinations.TWO_PAIR]: (p1, p2) => this[GameCombinations.ONE_PAIR](p1, p2),
    [GameCombinations.THREE_OF_A_KIND]: (p1, p2) => {
        const rank1 = p1.resultSet.highestThreesome.rank.get();
        const rank2 = p2.resultSet.highestThreesome.rank.get();
        return this.rankCompare(rank1,rank2,p1,p2);
    },
    [GameCombinations.FULL_HOUSE]: (p1, p2) => {
        const threesomeCompareResult = this[GameCombinations.THREE_OF_A_KIND](p1, p2);
        if(threesomeCompareResult === null){
            return this[GameCombinations.ONE_PAIR](p1,p2);
        } else {
            return threesomeCompareResult;
        }
    },
    [GameCombinations.FOUR_OF_A_KIND]: (p1, p2) => {
        const rs1 = p1.resultSet;
        const rs2 = p2.resultSet; 
        const rank1 = rs1.foursome[rs1.foursome.length - 1].rank.get();
        const rank2 = rs2.foursome[rs2.foursome.length - 1].rank.get();
        return this.rankCompare(rank1,rank2,p1,p2);
    },
    [GameCombinations.STRAIGHT]: (p1, p2) => {
        const rs1 = p1.resultSet;
        const rs2 = p2.resultSet; 
        const rank1 = rs1.straight[rs1.straight.length - 1].rank.get();
        const rank2 = rs1.straight[rs2.straight.length - 1].rank.get();
        return this.rankCompare(rank1,rank2);
    },
    [GameCombinations.FLUSH]: (p1, p2) => {
        const rs1 = p1.resultSet;
        const rs2 = p2.resultSet; 
        const rank1 = rs1.flushCards[rs1.flushCards.length - 1].rank.get();
        const rank2 = rs1.flushCards[rs2.flushCards.length - 1].rank.get();
        return this.rankCompare(rank1,rank2);
    },
    [GameCombinations.STRAIGHT_FLUSH]: (p1, p2) => this[GameCombinations.STRAIGHT](p1, p2),
    [GameCombinations.ROYAL_FLUSH]: (p1, p2) => this[GameCombinations.STRAIGHT](p1, p2)
}
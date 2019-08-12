import { autorun, observable } from "mobx";
import SequenceModel from "./SequenceModel";

import GameScores from './GameScores';
import CardRanks from './CardRanks';

export default class ResultSetModel {
    similarRanks = {};
    isFlush = false;
    sequence = null;
    highCard = null;
    ranksSum = 0;

    get score(){
        if(this.isFlush && this.sequence != null){
            if(this.sequence.startingRank == CardRanks["10"]){
                return GameScores.ROYAL_FLUSH;
            } else {
                return GameScores.STRAIGHT_FLUSH;
            }
        } if(this.isFlush){
            return GameScores.FLUSH;
        } if(this.sequence != null){
            return GameScores.STRAIGHT;
        }

        const ranksArr = Object.keys(this.similarRanks);

        const countPairs = ranksArr.reduce(
            (pairs, currentRank) => this.similarRanks[currentRank] == 2 ? pairs + 1 : pairs,
            0
        );

        const threesomesCount = ranksArr.reduce(
            (threes, currentRank) => this.similarRanks[currentRank] == 3 ? threes + 1 : threes,
            0
        );

        if(countPairs == 1 && threesomesCount == 1){
            return GameScores.FULL_HOUSE;
        } else if(threesomesCount == 1){
            return GameScores.THREE_OF_A_KIND;
        } else if(countPairs == 2){
            return GameScores.TWO_PAIR;
        } else if(countPairs == 1){
            return GameScores.ONE_PAIR;
        }

        return GameScores.HIGH_CARD;
    }

    /**
     * RetrieveResultSet produces result set for each given set of cards
     * this function however is not gonna determine which player is the winner
     * or even which combinations are detected, it's simple goes through the cards
     * and creating an object with all the stats for the next step...
     */
    constructor(plainCards){
        if(!Array.isArray(plainCards)){
            return null;
        }

        let ranksMap = {};
        let signsMap = {};

        let currentCard = null, prevCard = null, currentRank, prevRank = null, currentSign, sequenceDiff = 0, sequenceStart = null;

        const sortedCards = plainCards.sort( (prev, current) => prev.rank - current.rank );

        for(var i = 0; i < sortedCards.length; i++){
            currentCard = sortedCards[i];

            if(i > 0){
                prevCard = sortedCards[i - 1];
                prevRank = prevCard.rank.get();
            }

            currentRank = currentCard.rank.get();
            currentSign = currentCard.sign.get();
            
            // Testing ranks diff
            if(currentRank - prevRank == 1){
                if(sequenceStart == null){
                    sequenceStart = currentRank;
                }
                sequenceDiff++;
            } else if(sequenceDiff < 5) {
                sequenceDiff = 1;
                sequenceStart = currentRank;
            }

            if(ranksMap.hasOwnProperty(currentRank)){
                ranksMap[currentRank]++;
            } else {
                ranksMap[currentRank] = 1;
            }

            if(!this.isFlush && signsMap.hasOwnProperty(currentSign)){
                signsMap[currentSign]++;
            } else {
                signsMap[currentSign] = 1;
            }

            if(signsMap[currentSign] == 5){
                this.isFlush = true;
            }

            const { highCard } = this;

            // High card check
            if(!highCard || highCard.rank < currentRank){
                this.highCard = currentCard;
            }

            // Score summrizing
            this.ranksSum += currentRank;
        }

        // Register only sequence of five cards (staright)
        if(sequenceDiff == 5){
            this.sequence = new SequenceModel(sequenceStart, sequenceDiff);
        }

        this.similarRanks = ranksMap;
    }
}
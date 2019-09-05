import { observable, runInAction } from "mobx";
import GameScores from '../Consts/GameScores';
import CardRanks from '../Consts/CardRanks';

export default class ResultSetModel {
    similarRanks = observable.map();
    similarSigns = observable.map();
    sequence = observable.array();
    highCard = observable({});
    ranksSum = observable.box(0);

    get score(){
        const signsArray = Array.from(this.similarSigns);
        const flushCards = signsArray.find(signsCount => signsCount.length >= 5) || [];

        if(flushCards.length > 0 && this.sequence.length > 0){
            
            let isStarightFlush = false;
            let equalCards = 0;

            for(var i = 0; i < flushCards.length && i < this.sequence.length; i++){
                if(flushCards[i].equals(this.sequence[i])){
                    equalCards++;
                }
            }

            console.log(`Is straight flush? ${isStarightFlush}`);

            if(equalCards >= 5){
                if(this.sequence[0].rank == CardRanks["10"]){
                    return GameScores.ROYAL_FLUSH;
                }
                return GameScores.STRAIGHT_FLUSH;
            }  

        }
        
        if(flushCards.length > 0){
            return GameScores.FLUSH;
        }
        
        if(this.sequence.length == 5){
            return GameScores.STRAIGHT;
        }

        const ranksArr = Array.from(this.similarRanks.toJS());

        console.log('ResultSetModel::score getter - Ranks array', ranksArr);

        let threesomesCount = 0,countPairs = 0,foursomeCount = 0;
        
        ranksArr.forEach((rank) => {
            if(rank === 2){
                countPairs++;
            } else if(rank === 3){
                threesomesCount++;
            } else if(rank === 4) {
                foursomeCount++;
            }
        })

        if(foursomeCount > 0){
            return GameScores.FOUR_OF_A_KIND;
        }

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

    clear = () => {
        runInAction(() => {
            this.similarRanks.clear();
            this.similarSigns.clear();
            this.sequence.splice(0, this.sequence.length);
        });
    }

    evaluate = (sortedCards) => {
        this.clear();
        let currentCard = null, prevCard = null, prevRank = null, currentRank, currentSign;

        for(var i = 0; i < sortedCards.length; i++){
            currentCard = sortedCards[i];
            currentRank = currentCard.rank.get();
            currentSign = currentCard.sign.get();

            if(i > 0){
                prevCard = sortedCards[i - 1];
                prevRank = prevCard.rank.get();

                // Testing ranks diff
                if(currentRank - prevRank == 1){
                    if(this.sequence.length === 0){
                        this.sequence.push(prevCard);
                        console.log(`First sequence card`, prevCard);
                    }
                    this.sequence.push(currentCard);
                } else if(this.sequence.length < 5) {
                    this.sequence.clear();
                }
            }
    
            // Stats for finding Pairs | Three of a kind | Four of a kind
            if(this.similarRanks.has(currentRank)){
                const oldRanksCount = this.similarRanks.get(currentRank);
                console.log('Old rank count', oldRanksCount)
                this.similarRanks.set(currentRank, oldRanksCount + 1);
            } else {
                this.similarRanks.set(currentRank,1);
            }

            // Stats for finding Flush
            if(!this.similarSigns.has(currentSign)){
                this.similarSigns.set(currentSign,[]);
            }
            this.similarSigns.get(currentSign).push(currentCard);
            console.log('ResultSetModel.js::calcStats current similar rank', this.similarSigns.get(currentSign));

            // High card check
            if(!this.highCard || this.highCard.rank < currentRank){
                this.highCard.set(currentCard);
            }

            // Score summrizing
            this.ranksSum.set(this.ranksSum.get() + currentRank);
        }
    }
}
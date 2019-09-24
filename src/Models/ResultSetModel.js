import { observable, runInAction } from "mobx";
import GameCombinations from '../Consts/GameCombinations';
import CardRanks from '../Consts/CardRanks';

export default class ResultSetModel {
    highCard = observable({});
    flushCards = observable.array();
    straight = observable.array();

    pairs = observable.map();
    threesomes = observable.map();
    foursome = observable.array();
    
    // Helper function for our map properties
    // TODO: consider moving to seperate file
    getMaxByKey = (map) => {
        let max = null;

        for(const currentKey in map.keys()){
            if(parseInt(currentKey) > parseInt(max)){
                max = parseInt(currentKey);
            }
        }

        return max ? map.get(max) : null;
    }

    get highestStraight(){
        if(this.straight.length < 5){
            return null;
        }
        return this.straight.slice(this.straight.length - 5, this.straight.length);
    }

    get highestPair(){
        return this.getMaxByKey(this.pairs);
    }

    get highestThreesome(){
        return this.getMaxByKey(this.threesomes);
    }

    get highestFullhouse(){
        if(this.highestPair === null || this.highestThreesome === null){
            return null;
        }
        return this.highestThreesome.concat(this.highestPair);
    }

    get bestCombination(){
        if(this.flushCards.length > 0 && this.straight.length > 0){
            let isStarightFlush = false;
            let equalCards = 0;

            for(var i = 0; i < this.flushCards.length && i < this.straight.length; i++){
                if(this.flushCards[i].equals(this.straight[i])){
                    equalCards++;
                }
            }

            console.log(`Is straight flush? ${isStarightFlush}`);

            if(equalCards >= 5){
                if(this.sequence[0].rank == CardRanks["10"]){
                    return GameCombinations.ROYAL_FLUSH;
                }
                return GameCombinations.STRAIGHT_FLUSH;
            }  

        }
        
        if(this.flushCards.length > 0){
            return GameCombinations.FLUSH;
        }
        
        if(this.straight.length > 0){
            return GameCombinations.STRAIGHT;
        }

        if(this.foursome.length > 0){
            return GameCombinations.FOUR_OF_A_KIND;
        }

        if(this.highestPair !== null && this.highestThreesome !== null){
            return GameCombinations.FULL_HOUSE;
        } else if(parseInt(this.threesomes.size) > 0){
            return GameCombinations.THREE_OF_A_KIND;
        } else if(this.pairs.size === 2){
            return GameCombinations.TWO_PAIR;
        } else if(this.pairs.size === 1){
            return GameCombinations.ONE_PAIR;
        }

        return GameCombinations.HIGH_CARD;
    }

    clear = () => {
        // TODO: consider to remove this method and use the power of computed values instead of clearing everytime
        const r = runInAction(() => {
            const maps = [ this.threesomes, this.pairs ];
            maps.forEach(m => m.clear());

            const arrays = [ this.straight, this.foursome, this.flushCards ];
            arrays.forEach(a => a.splice(0, a.length));
        });
        console.log(r);
    }

    evaluate = (sortedCards) => {
        this.clear();
        let currentCard = null, prevCard = null, prevRank = null, currentRank, currentSign;

        const similarRanks = new Map();
        const similarSigns = new Map();
        const sequence = [];
        let highestCard = null;

        for(var i = 0; i < sortedCards.length; i++){
            currentCard = sortedCards[i];
            currentRank = currentCard.rank.get();
            currentSign = currentCard.sign.get();

            if(i > 0){
                prevCard = sortedCards[i - 1];
                prevRank = prevCard.rank.get();

                // Testing ranks diff
                if(currentRank - prevRank == 1){
                    if(sequence.length === 0){
                        sequence.push(prevCard);
                        console.log(`First sequence card`, prevCard);
                    }
                    sequence.push(currentCard);
                } else if(sequence.length < 5) {
                    sequence.clear();
                }
            }
    
            // Stats for finding Pairs | Three of a kind | Four of a kind
            if(!similarRanks.has(currentRank)){
                similarRanks.set(currentRank, []);
            }
            similarRanks.get(currentRank).push(currentCard);
            
            // Stats for finding Flush
            if(!similarSigns.has(currentSign)){
                similarSigns.set(currentSign,[]);
            }
            similarSigns.get(currentSign).push(currentCard);

            // High card check
            if(!highestCard || highestCard.rank.get() < currentRank){
                highestCard = currentCard;
            }
        }

        this.highCard = highestCard;
        const signsArray = Array.from(similarSigns);
        const isFlush = signsArray.findIndex(signsCount => signsCount.length >= 5) > -1;

        runInAction(() => {
            console.log('Damn highCard', this.highCard);
            if(isFlush){
                this.flushCards.replace(signsArray);
            }

            if(sequence.length >= 5){
                this.straight.replace(sequence);
            }
            
            console.log('Similar ranks before convertion to related fields', similarRanks);

            similarRanks.forEach((cardsArr, rank) => {
                const combSize = cardsArr.length;
                if(combSize === 2){
                    this.pairs.set(rank, cardsArr);
                } else if(combSize === 3){
                    this.threesomes.set(rank, cardsArr);
                } else if(combSize === 4){
                    this.foursome.replace(cardsArr);
                }
            });
        })
    }
}
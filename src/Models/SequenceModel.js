import CardModel from './CardModel';

export default class SequenceModel {
    startingRank = 0;
    offest = 0;

    constructor(s, o){
        this.startingRank = s;
        this.offest = o;
    }
}
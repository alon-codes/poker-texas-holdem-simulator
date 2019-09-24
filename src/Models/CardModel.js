import { observable } from "mobx";
import { MAX_RANK } from "../Consts/CardRanks";
import { CardSigns } from "../Consts/CardSigns";

export default class CardModel {
    sign = observable.box('');
    rank = observable.box('');
    isHighlighted = observable.box(false);
    isDuplicated = observable.box(false);
    order = 0;

    static count = 0;

    constructor(s, r){
        this.order = ++CardModel.count;
        this.set(s, r);
    }

    static getRandomRank(){
        return Math.floor(Math.random() * (MAX_RANK + 1));
    }

    static getRandomSign(){
        const signsArr = Object.keys(CardSigns);
        const randNum  = Math.floor(Math.random() * 4);
        return CardSigns[signsArr[randNum]];
    }

    set = (s, r, isHighlighted = false) => {
        this.rank.set(r);
        this.sign.set(s);
        this.isHighlighted.set(isHighlighted);
    }

    fromOther = (card) => {
        console.log('CardModel::fromOther changed card', card);
        this.set(card.sign.get(), card.rank.get(), card.isHighlighted.get());
    }

    get id(){
        return `${this.sign}${this.rank}`;
    }

    equals = (other) => {
        return other.id === this.id;
    }

    toString(){
        return `${this.sign}-${this.rank}`;
    }

    static fromId = (id) => {
        const sign = id.charAt(0);
        const rank = parseInt(id.slice(1));
        console.log('Fromid id, sign, rank', sign, rank, id);
        return new CardModel(sign, rank);
    }
}
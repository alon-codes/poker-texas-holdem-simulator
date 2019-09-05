import { observable } from "mobx";

export default class CardModel {
    sign = observable.box('');
    rank = observable.box('');
    isHighlighted = observable.box(false);

    constructor(s, r){
        this.set(s, r);
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
        return other.rank.get() === this.rank.get() &&
               other.sign.get() === this.sign.get();
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
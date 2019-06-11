import { observable } from "mobx";

export default class CardModel {
    sign = observable.box('');
    rank = observable.box('');
    isHighlighted = observable.box(false);
}
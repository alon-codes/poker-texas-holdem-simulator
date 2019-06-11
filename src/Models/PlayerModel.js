import { observable } from "mobx";

export default class PlayerModel {
    playerName = observable.box('');
    cards = observable.array();
    id = observable.box('');

    constructor(playerName){
        this.playerName.set(playerName);
    }
}
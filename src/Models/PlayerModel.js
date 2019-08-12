import { observable } from "mobx";
import ResultSetModel from "./ResultSetModel";

export default class PlayerModel {
    playerName = observable.box('');
    cards = observable.array();
    id = observable.box('');
    resultSet = null;

    constructor(playerName){
        this.playerName.set(playerName);
    }
}
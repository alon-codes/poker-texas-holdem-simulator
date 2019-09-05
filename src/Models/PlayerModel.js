import { observable, runInAction, observe, reaction } from "mobx";
import ResultSetModel from "./ResultSetModel";

export default class PlayerModel {
    playerName = observable.box('');
    cards = observable.array();
    currentTableCards = observable.array();
    id = '';
    resultSet = null;    

    static playerCount = 0;

    constructor(playerName){
        this.playerName.set(playerName);
        PlayerModel.playerCount++;
        this.id = PlayerModel.playerCount;
        this.resultSet = new ResultSetModel;
        reaction(
            () => this.currentTableCards.concat(this.cards).sort((prev, current) => prev.rank - current.rank),
            (sortedCards) => this.resultSet.evaluate(sortedCards)
        );
    }

    replaceCard = (originalCard, incomingCard) => {
        const indexInPlayerCards = this.cards.findIndex(c => originalCard.equals(c));

        console.log('PlayerModel::replaceCard updating player: card index in the array', indexInPlayerCards);
        console.log('PlayerModel::replaceCard recevied card', originalCard);

        if(indexInPlayerCards >= 0){
            runInAction(() => {
                this.cards[indexInPlayerCards] = incomingCard;
            });
            return true;
        }

        return false;
    }
}
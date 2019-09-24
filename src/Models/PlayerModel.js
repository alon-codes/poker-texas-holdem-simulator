import { observable, observe } from "mobx";
import ResultSetModel from "./ResultSetModel";
import CardsFactoryStore from '../Stores/CardsFactoryStore'
import PlayerStatus from '../Consts/PlayerStatus';

export default class PlayerModel {
    playerName = observable.box('');
    cards = observable.array();
    currentTableCards = observable.array();
    id = '';
    resultSet = null;

    // TODO: @depeteacted
    isWinner = observable.box(false);
    status = observable.box(PlayerStatus.NONE);

    static playerCount = 0;

    constructor(playerName){
        this.playerName.set(playerName);
        this.id = ++PlayerModel.playerCount;
        observe(this.cards, CardsFactoryStore.autoObserve);
        this.resultSet = new ResultSetModel;
    }

    get duplicateCard(){
        return this.cards.find(c => c.isDuplicated.get());
    }

    replaceCard = (originalCard, incomingCard) => {
        const indexInPlayerCards = this.cards.findIndex(c => originalCard.order === c.order);

        console.log('PlayerModel::replaceCard updating player: card index in the array', indexInPlayerCards);
        console.log('PlayerModel::replaceCard recevied card', originalCard);

        if(indexInPlayerCards >= 0){
            this.cards[indexInPlayerCards] = incomingCard;
            return true;
        }

        return false;
    }
}
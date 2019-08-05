import { observable, transaction, autorun, computed } from 'mobx';
import CardModel from '../Models/CardModel';
import PlayerModel from '../Models/PlayerModel';

// Texas Holdem based limitions
const MAX_PLAYERS_PER_GAME = 22;
const MAX_CARDS_PER_TABLE = 5;
const MAX_CARDS_PER_PLAYER = 2;
const TOTAL_MINIMUM_AMOUNT_OF_CARDS = 5;

class GameStore {
    players = observable.array();
    tableCards = observable.array();
    isLoading = observable.box(false);
    winner = observable({});

    get totalPlayersCardsAmount(){
        if(this.players.length > 0){
            return this.players.map(p => p.cards.length).reduce(0, (nextPl, preVal) => preVal + nextPl.tableCards.length);
        }
        
        return 0;
    }

    calculateOdds = () => {
        console.log(`Total player cards amount ${this.totalPlayersCardsAmount}`);

        const playerCardsTotalAmount = this.totalPlayersCardsAmount;
              
        if(playerCardsTotalAmount % 2 != 0){
            console.error(`Can't start game - each player must have 2 playing cards`);
            return false;
        }

        const tableCardsAmount = this.tableCards.length;

        if(tableCardsAmount + playerCardsTotalAmount <= TOTAL_MINIMUM_AMOUNT_OF_CARDS){
            console.error(`Can't start game - not enough cards to start the game the minimum is ${TOTAL_MINIMUM_AMOUNT_OF_CARDS}`);
            return false;
        }


    }

    constructor(){
        autorun(this.calculateOdds);

        transaction(() => {
            this.addCardToTable(14,"D");
            this.addCardToTable(6,"C");
            this.addCardToTable(7,"H");
            this.addCardToTable(6,"S");
            this.addCardToTable(13,"D");
            this.addCardToTable(13,"H");
        });
    }

    isSameCard = (card, other) => {
        return card.rank.get() === other.rank.get() && card.sign.get() === other.sign.get();
    }

    checkCardUniqueness = (incomingCard) => {
        console.log(`rank - ${incomingCard.rank.get()}, sign - ${incomingCard.sign.get()}`);

        const isPlayersCard = this.players.some((player) => {
            let foundCard = player.cards.find(card => this.isSameCard(card, incomingCard));
            console.log(`foundCard - ${JSON.stringify(foundCard)}`);
            return foundCard != null;
        });

        console.log(`isPlayersCard - ${isPlayersCard}`);

        const isOnTable = this.tableCards.some((card) => {
            return this.isSameCard(card, incomingCard)
        });

        console.log(`isOnTable - ${isOnTable}`);

        return !isPlayersCard && !isOnTable;
    }

    addCardToTable = (rank, sign) => {
        transaction(() => {
            const incomingCard = new CardModel();
            incomingCard.sign.set(sign);
            incomingCard.rank.set(rank);

            if(this.tableCards.length + 1 <= MAX_CARDS_PER_TABLE && this.checkCardUniqueness(incomingCard)){
                this.tableCards.push(incomingCard);
            }
        });
    }

    addCardToPlayer = (playerId, rank, sign) => {
        const player = this.players.find(p => p.id === playerId);

        if(!player || player.cards.length + 1 > MAX_CARDS_PER_PLAYER){
            return false;
        }
        
        const incomingCard = new CardModel();
        incomingCard.sign.set(sign);
        incomingCard.rank.set(rank);
        
        if(this.checkCardUniqueness(incomingCard)){
            player.cards.push(incomingCard);
            return true;
        }

        return false;
    }

    addPlayer = (playerName) => {
        if(this.players.length + 1 <= MAX_PLAYERS_PER_GAME){
            const incomingPlayer = new PlayerModel(playerName);
            incomingPlayer.id = Math.random() * 10;
            this.players.push(incomingPlayer);

            console.info(incomingPlayer.id);

            return true;
        }
        
        return false;
    }

    testFill = () => {
        transaction(() => {
            this.addPlayer("Player 1");
            this.addCardToPlayer(this.players[0].id, 6, "C");
            this.addCardToPlayer(this.players[0].id, 11, "D");
        })        
    }
}

const store = new GameStore;
window.store = store;
export default store;
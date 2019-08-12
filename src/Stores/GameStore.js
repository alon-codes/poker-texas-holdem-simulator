import { observable, transaction, autorun, computed } from 'mobx';
import CardModel from '../Models/CardModel';
import PlayerModel from '../Models/PlayerModel';
import ResultSetModel from '../Models/ResultSetModel';

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
        return this.players.map(p => p.cards.length)
                           .reduce((current, nextPl) => current + nextPl, this.tableCards.length);
    }

    calculateOdds = () => {
        /*console.log(`Total player cards amount ${this.totalPlayersCardsAmount}`);

        const playerCardsTotalAmount = this.totalPlayersCardsAmount;

        if(playerCardsTotalAmount % 2 != 0){
            console.error(`Can't start game - each player must have 2 playing cards`);
            return false;
        }

        const tableCardsAmount = this.tableCards.length;

        if(tableCardsAmount + playerCardsTotalAmount <= TOTAL_MINIMUM_AMOUNT_OF_CARDS){
            console.error(`Can't start game - not enough cards to start the game the minimum is ${TOTAL_MINIMUM_AMOUNT_OF_CARDS}`);
            return false;
        }*/

        this.players.forEach(this.processPlayerCards);
    }

    constructor(){
        autorun(this.calculateOdds);

        // TODO: consider to remove
        /*
        transaction(() => {
            this.addCardToTable(14,"D");
            this.addCardToTable(6,"C");
            this.addCardToTable(7,"H");
            this.addCardToTable(6,"S");
            this.addCardToTable(13,"D");
        });*/
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

    processPlayerCards = (p) => {
        const allCards = p.cards.concat(this.tableCards);
        p.resultSet = new ResultSetModel(allCards);
        console.info(`Player ${p.playerName} - result set`);
        console.log(p.resultSet);
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
            incomingPlayer.id = this.players.length + 1;
            this.players.push(incomingPlayer);
            return incomingPlayer;
        }
        
        return null;
    }

    // Test cases
    // TODO: move them away to test file
    testPlayerCreation = () => {
        const player1Object = this.addPlayer("Alon");
        const player2Object = this.addPlayer("Denis");

        this.addCardToPlayer(player1Object.id ,7, "C");
        this.addCardToPlayer(player1Object.id, 10, "D");

        this.addCardToPlayer(player2Object.id ,12, "H");
        this.addCardToPlayer(player2Object.id, 10, "S");

        this.addCardToTable(13,"H");        
    }

    testStaright = () => {
        transaction(() => {
            const player1Object = this.addPlayer("Alon");
            const player2Object = this.addPlayer("Denis");

            this.addCardToPlayer(player1Object.id ,6, "C");
            this.addCardToPlayer(player1Object.id, 7, "D");

            this.addCardToPlayer(player2Object.id ,12, "H");
            this.addCardToPlayer(player2Object.id, 10, "S");
            
            // Table Cards
            this.addCardToTable(14,"D");
            this.addCardToTable(8,"D");
            this.addCardToTable(9,"C");
            this.addCardToTable(10,"H");
            this.addCardToTable(3,"S");        
            this.addCardToTable(14,"H");
        });
    }
}

const store = new GameStore;
window.store = store;
export default store;
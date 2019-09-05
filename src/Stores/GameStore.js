import { observable, runInAction, autorun, flow, reaction, observe } from 'mobx';
import SortedSet from 'collections/sorted-set';
import CardModel from '../Models/CardModel';
import PlayerModel from '../Models/PlayerModel';
import { MAX_PLAYERS_PER_GAME,MAX_CARDS_PER_TABLE,MAX_CARDS_PER_PLAYER} from '../Consts/GameRules';
import { MIN_RANK, MAX_RANK } from '../Consts/CardRanks';

class GameStore {
    isLoading = observable.box(false);
    winner = observable({});
    
    players = observable.array();
    tableCards = observable.array();
    cardsInSession = null;

    constructor(){
        this.cardsInSession = SortedSet([]);
        observe(this.tableCards, (change) => this.players.forEach(p => p.currentTableCards = this.tableCards));
        // TODO: remove this soon you done testing UI
        this.testStaright();
    }

    /**
     * ResetGame function will clear all store data like players, tableCards
     * TODO: test it!
     */
    resetGame = () => {
        runInAction(() => {
            this.tableCards.splice(0, this.tableCards.length);
            this.players.splice(0, this.players.length);
        });
    }

    calculateResults = () => {
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
    }

    /**
     * Adds the card to the SortedSet in order
     * to maintain unique card ranks
     */
    registerCard = (id) => {
        if(!this.cardsInSession.has(id)){
            this.cardsInSession.push(id);
            return true;
        }

        return false;
    }

    /**
     * Removes the card from the SortedSet in order
     * to free the allocated for future usage
     */
    unregisterCard = (id) => {
        if(this.cardsInSession.has(id)){
            this.cardsInSession.delete(id);
            return true;
        }

        return false;
    }
    
    /**
     * Replaces existing cards, for existing player/on the table
     */
    replaceExistingCard = (player = null, incomingCard, originalCard) => {
        if(player == null){
            const cardIndexInTable = this.tableCards.findIndex(c => originalCard.equals(c));
            console.log('GameStore::updateExistingCard updating table card: index in the array', cardIndexInTable);
            console.log('GameStore::updateExistingCard ', cardIndexInTable);
            if(cardIndexInTable >= 0){
                this.tableCards[cardIndexInTable] = incomingCard;
            } else {
                // TODO: handle this error
                return false;
            }
        } else {
            player.replaceCard(originalCard, incomingCard);
        }
    }

    changeSign = (playerId, originalCard, nSign) => {
        const player = playerId ? this.players.find(p => p.id == playerId) : null;
        const incomingCard = new CardModel(nSign, originalCard.rank.get());
        this.registerCard(incomingCard.id);
        this.replaceExistingCard(player, incomingCard, originalCard);
        this.unregisterCard(originalCard.id);
    };

    /**
     * Finds next aviable card and replaces the old one
     */
    nextRank = (playerId = null, originalCard) => {
        const player = this.players.find(player => player.id == playerId);
        console.log('GameStore - nextRank', player, originalCard);

        const originalRank = originalCard.rank.get();
        const originalSign = originalCard.sign.get();

        // Copying card details to new card
        const incomingCard = new CardModel(originalSign, originalRank);

        let nextRank = originalRank;
        let isCreated = false;

        // Increase rank until finding aviable card
        while(isCreated === false){
            console.log('GameStore::nextRank nextRank, incomingCard', nextRank, incomingCard);

            // Checking if it's ACE
            if(nextRank === MAX_RANK){
                nextRank = MIN_RANK;
            } else {
                nextRank++;
            }
            
            // When the new rank is once again the same is
            // the original it means that will exhausted all free cards
            if(nextRank == originalRank){
                break;
            }

            incomingCard.rank.set(nextRank);

            isCreated = this.registerCard(incomingCard.id);
        }

        this.replaceExistingCard(player, incomingCard, originalCard);
        this.unregisterCard(originalCard.id);
    }

    /**
     * Finds the next lower aviable card and replaces the old one
     */
    prevRank = (playerId = null, originalCard) => {
        console.log('GameStore::prevRank playerId, card object', playerId, originalCard);
        const player = this.players.find(player => player.id == playerId);
        console.log('GameStore::prevRank found player using id', player);

        const originalRank = originalCard.rank.get();
        const originalSign = originalCard.sign.get();

        // Copying card details to new card
        const incomingCard = new CardModel(originalSign, originalRank);
        
        let prevRank = originalRank;
        let isCreated = false;

        // Decrease rank until finding aviable card
        while(isCreated === false){
            console.log('GameStore::prevRank prevRank, incomingCard', prevRank, incomingCard);

            // Checking if it's 2
            if(prevRank === MIN_RANK){
                prevRank = MAX_RANK;
            } else {
                prevRank--;
            }
            
            // When the new rank is once again the same is
            // the original it means that will exhausted all free cards
            if(prevRank == originalRank){
                break;
            }

            incomingCard.rank.set(prevRank);
            isCreated = this.registerCard(incomingCard.id);
        }   

        this.replaceExistingCard(player, incomingCard, originalCard);
        this.unregisterCard(originalCard.id);
    }

    /**
     * Store Actions
     **/

    /**
     * Adds a card to the table base on rank & sign
     */
    addCardToTable = (rank, sign) => {
        const incomingCard = new CardModel();
        incomingCard.sign.set(sign);
        incomingCard.rank.set(rank);
        
        if(this.tableCards.length + 1 <= MAX_CARDS_PER_TABLE && this.registerCard(incomingCard.id)){
            this.tableCards.push(incomingCard);
        }
    }

    /**
     * Adds a card to a player
     */
    addCardToPlayer = (playerId, rank, sign) => {
        const player = this.players.find(p => p.id === playerId);

        if(!player || player.cards.length + 1 > MAX_CARDS_PER_PLAYER){
            return false;
        }
        
        const incomingCard = new CardModel(sign, rank);
        
        if(this.registerCard(incomingCard.id)){
            player.cards.push(incomingCard);
            return true;
        }

        return false;
    }

    /**
     * Adds a new player to the table
     */
    addPlayer = (playerName) => {
        if(this.players.length + 1 <= MAX_PLAYERS_PER_GAME){
            const incomingPlayer = new PlayerModel(playerName);
            this.players.push(incomingPlayer);

            // TODO: attach 2 random card to player

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
        runInAction(() => {
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

    testFlush = async () => {
        await this.resetGame();

        runInAction(() => {
            const player1Object = this.addPlayer("Alon");
            const player2Object = this.addPlayer("Denis");

            this.addCardToPlayer(player1Object.id ,6, "D");
            this.addCardToPlayer(player1Object.id, 7, "D");

            this.addCardToPlayer(player2Object.id ,12, "H");
            this.addCardToPlayer(player2Object.id, 10, "S");
            
            // Table Cards
            this.addCardToTable(14, "D");
            this.addCardToTable(8, "D");
            this.addCardToTable(9,"C");
            this.addCardToTable(10,"H");      
            this.addCardToTable(12, "D");
        });
    }

    testStarightFlush = async () => {
        await this.resetGame();

        runInAction(() => {
            const player1Object = this.addPlayer("Alon");
            const player2Object = this.addPlayer("Denis");

            this.addCardToPlayer(player1Object.id ,6, "D");
            this.addCardToPlayer(player1Object.id, 7, "D");

            this.addCardToPlayer(player2Object.id ,12, "H");
            this.addCardToPlayer(player2Object.id, 10, "S");
            
            // Table Cards
            this.addCardToTable(14, "D");
            this.addCardToTable(8, "D");
            this.addCardToTable(9,"D");
            this.addCardToTable(10,"D");
            this.addCardToTable(12, "C");
        });
    }

    testNoFlush = async () => {
        await this.resetGame();

        runInAction(() => {
            

            const player1Object = this.addPlayer("Alon");
            const player2Object = this.addPlayer("Denis");

            this.addCardToPlayer(player1Object.id ,6, "D");
            this.addCardToPlayer(player1Object.id, 7, "D");

            this.addCardToPlayer(player2Object.id ,12, "H");
            this.addCardToPlayer(player2Object.id, 10, "S");
            
            // Table Cards
            this.addCardToTable(14, "D");
            this.addCardToTable(8, "D");
            this.addCardToTable(9,"C");
            this.addCardToTable(10,"H");      
            this.addCardToTable(13, "H");
        });
    }
}

const store = new GameStore;

window.store = store;
export default store;
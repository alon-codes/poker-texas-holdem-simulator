import { observable, runInAction, autorun, flow, reaction, observe, intercept } from 'mobx';
import SortedSet from 'collections/sorted-set';
import CardModel from '../Models/CardModel';
import PlayerModel from '../Models/PlayerModel';
import { MAX_PLAYERS_PER_GAME,MAX_CARDS_PER_TABLE,MAX_CARDS_PER_PLAYER} from '../Consts/GameRules';
import { MIN_RANK, MAX_RANK } from '../Consts/CardRanks';
import GameStatuses from '../Consts/GameStatuses';
import CardsFactoryStore from './CardsFactoryStore';
import GameComparators from '../Consts/GameComparators';
class GameStore {
    isLoading = observable.box(false);
    players = observable.array();
    tableCards = observable.array();

    watcheres = [];

    mergeAndSort = (playerObj) => playerObj.cards.concat(this.tableCards).sort((prev, current) => prev.rank - current.rank);

    /**
     * (player cards += table cards) combination, using mobx reaction
     * to detect changes and immediately update the result set 
     * for each player to re-calculate bestCombination,
     * and decide about new winner
     */
    registerPlayerWatcher = (playerObj, index) => {
        const disposer = reaction(() => this.mergeAndSort(playerObj), (sortedCards) => {
            playerObj.resultSet.evaluate(sortedCards);
            const winningPlayer = this.getWinner();
            runInAction(() => {
                this.players.forEach(p => p.isWinner.set(false));
                if(winningPlayer != null){
                    winningPlayer.isWinner.set(true);
                }
            });                     
        });
        this.watcheres[index] = disposer;
    }

    get duplicatePlayer(){
        return this.players.find(p => p.duplicateCard != null);
    } 

    constructor(){
        observe(this.tableCards, CardsFactoryStore.autoObserve);
        observe(this.players, ({ added, newValue}) => {
            if(!!added){
                added.forEach(this.registerPlayerWatcher);
            }         
        });

        // TODO: remove this soon you done testing UI
        this.testNoFlush();
    }

    getWinner = () => {
        // Can't compare player when there is only one
        if(this.players.length <= 1){
            return null;
        }

        let leadingPlayer = this.players[0];        

        for(var i = 1; i < this.players.length; i++){
            const currentPlayer = this.players[i];
            const currentPlayerCombination = currentPlayer.resultSet.bestCombination;
            const leadingCombination = leadingPlayer.resultSet.bestCombination;
            if(currentPlayerCombination === leadingCombination){
                console.log('GameStore::getWinner - CurrentPlayer', currentPlayer);
                console.log('GameStore::getWinner - LeadingPlayer', leadingPlayer);
                const diffResult = GameComparators[currentPlayerCombination](currentPlayer, leadingPlayer);
                if(diffResult !== null){
                    leadingPlayer = diffResult;
                }
            } else if(currentPlayerCombination > leadingCombination){
                leadingPlayer = currentPlayer;
            }
        }

        if(leadingPlayer !== null){
            leadingPlayer.isWinner.set(true);
        }

        return leadingPlayer;
    }

    get gameStatus(){
        if(this.duplicatePlayer != null){
            return GameStatuses.DUPLICATE_CARD;
        }

        if(!this.winner){
            return GameStatuses.DRAW;
        } else {
            return GameStatuses.PLAYER_WINNING;
        }
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
     * Replaces existing cards, for existing player/on the table
     */
    replaceExistingCard = (player = null, incomingCard, originalCard) => {
        if(player == null){
            const cardIndexInTable = this.tableCards.findIndex(c => originalCard.order === c.order);
            if(cardIndexInTable >= 0){
                this.tableCards[cardIndexInTable] = incomingCard;
            }
        } else {
            player.replaceCard(originalCard, incomingCard);
        }
    }

    changeSign = (playerId, originalCard, nSign) => {
        const player = playerId ? this.players.find(p => p.id == playerId) : null;
        const incomingCard = new CardModel(nSign, originalCard.rank.get());
        this.replaceExistingCard(player, incomingCard, originalCard);
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

        let nextRank = originalRank;
        // Checking if it's ACE
        if(originalRank === MAX_RANK){
            nextRank = MIN_RANK;
        } else {
            nextRank++;
        }

        const incomingCard = new CardModel(originalSign, nextRank);
        this.replaceExistingCard(player, incomingCard, originalCard);
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
        
        let prevRank = originalRank;

        // Checking if it's 2
        if(prevRank === MIN_RANK){
            prevRank = MAX_RANK;
        } else {
            prevRank--;
        }

        // Copying card details to new card
        const incomingCard = new CardModel(originalSign, prevRank);
        this.replaceExistingCard(player, incomingCard, originalCard);
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
        
        if(this.tableCards.length + 1 <= MAX_CARDS_PER_TABLE){
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
        player.cards.push(incomingCard);
    }

    /**
     * Adds a new player to the table
     */
    addPlayer = (playerName, skipRandom = true) => {
        if(this.players.length + 1 <= MAX_PLAYERS_PER_GAME){
            const incomingPlayer = new PlayerModel(playerName);
            this.players.push(incomingPlayer);
            this.registerPlayerWatcher(incomingPlayer, this.players.length - 1);

            // TODO: attach 2 random card to player
            if(!skipRandom){
                this.generateRandomCards(incomingPlayer);
            }

            return incomingPlayer;
        }
        
        return null;
    }

    // TODO: re-write this function in the future
    generateRandomCards = (player,amount = 2) => {
        const cardsAmount = amount;

        let cardsCount = 0;
        let tempRank = 0;
        let tempSign = 0;
        let tempCard = null;

        if(player.cards.length === 2){
            return;
        }
        tempRank = CardModel.getRandomRank();
        tempSign = CardModel.getRandomSign();
        tempCard = new CardModel(tempSign, tempCard);
        cardsCount++;
        player.cards.push(tempCard);
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
            const somebody = this.addPlayer("Somebody");
            const other = this.addPlayer('other');

            this.addCardToPlayer(player1Object.id ,6, "D");
            this.addCardToPlayer(player1Object.id, 7, "D");

            this.addCardToPlayer(player2Object.id ,12, "H");
            this.addCardToPlayer(player2Object.id, 10, "S");

            this.addCardToPlayer(somebody.id ,14, "H");
            this.addCardToPlayer(somebody.id, 4, "S");

            this.addCardToPlayer(other.id ,7, "H");
            this.addCardToPlayer(other.id, 5, "S");
            
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
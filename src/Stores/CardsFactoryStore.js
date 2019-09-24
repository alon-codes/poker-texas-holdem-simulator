import SortedSet from 'collections/sorted-set';
import { observable, runInAction } from 'mobx';
import CardModel from '../Models/CardModel';

class CardsFactoryStore {
    cardsInSession = null;

    constructor(){
        this.cardsInSession = SortedSet([]);
    }

    validateCardChange = (card, oldCard = null) => {
        if(!this.registerCard(card.id)){
            card.isDuplicated.set(true);
            return false;
        }

        if(!!oldCard){
            this.unregisterCard(oldCard.id);
            if(oldCard.isDuplicated.get()){
                oldCard.isDuplicated.set(false);
            }
        }

        return true;
    }

    autoObserve = ({newValue, oldValue, added}) => {
        if(!!newValue){
            this.validateCardChange(newValue, oldValue);
        } else if(!!added) {
            runInAction(() => {
                added.forEach(c => this.validateCardChange(c));
            });            
        }
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

    hasCard = (s,r) => {
        const card = new CardModel(s,r);
        return this.cardsInSession.has(card.id);
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
}

const cardsStorage = new CardsFactoryStore();
window.cardsStorage = cardsStorage;
export default cardsStorage;
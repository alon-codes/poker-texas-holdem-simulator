import SortedSet from 'collections/sorted-set';
import { observable, runInAction } from 'mobx';

class CardsFactoryStore {
    cardsInSession = null;

    constructor(){
        this.cardsInSession = SortedSet([]);
    }

    validateCardChange = (card, old = null) => {
        if(!this.registerCard(card.id)){
            card.isDuplicated.set(true);
            return false;
        }

        if(old){
            this.unregisterCard(old.id);
            if(old.isDuplicated.get()){
                old.isDuplicated.set(false);
            }
        }

        return true;
    }

    autoObserve = ({type, object, newValue, oldValue, added}) => {
        console.log('Check checkCardUniqueness ----')
        console.log('type', type);
        console.log('target object', object);
        console.log('new value', newValue);

        if(!!newValue){
            this.validateCardChange(newValue, oldValue);
        } else if(!!added) {
            runInAction(() => {
                added.every(c => this.validateCardChange(c));
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
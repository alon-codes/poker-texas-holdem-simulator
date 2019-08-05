import React from 'react';
import PlayerCard from './Components/PlayerCard';
import CardsUnit from './Components/CardsUnit';
import { observer, inject } from 'mobx-react';
import { styled } from '@material-ui/styles';

class App extends React.Component {
  render(){
    console.log("Props");
    console.log(this.props);

    const { players, tableCards, winner } = this.props.gameStore;

    const playersList = players && players.map(({playerName,cards,id}) => {
      console.log(cards);
  
      const cardsList = cards.map((c, index) => <PlayerCard key={index} rank={c.rank.get()} sign={c.sign.get()} />);
  
      console.log(cardsList);
  
      return (
        <CardsUnit key={id} playerName={playerName.get()}>
          { cardsList }
        </CardsUnit>
      ) 
    });
  
    const tableCardsList = tableCards && tableCards.map( (c, index) => {
      return <PlayerCard key={index} rank={c.rank.get()} sign={c.sign.get()} />;
    });
  
    const message = winner ? winner.playerName : `Add more cards to see `;
  
    return (
      <div className="App">
        { playersList }
        <CardsUnit playerName="Table">
          { tableCardsList }
        </CardsUnit>
        <p>{ message }</p>
      </div>
    );
  }
}

export default inject('gameStore')(observer(App));

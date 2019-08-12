import React from 'react';
import PlayerCard from './Components/PlayerCard';
import CardsUnit from './Components/CardsUnit';
import { observer, inject } from 'mobx-react';
import { styled } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

class App extends React.Component {
  render(){
    console.log("Props");
    console.log(this.props);

    const { players, tableCards, winner, totalPlayersCardsAmount } = this.props.gameStore;

    const playersList = players && players.map(({playerName,cards,id,resultSet}) => {
      console.log(cards);
  
      const cardsList = cards.map((c, index) => <PlayerCard key={index} rank={c.rank.get()} sign={c.sign.get()} />);
      
      const score = resultSet != null ? resultSet.score : "";

      return (
        <CardsUnit key={id} playerName={playerName.get()} score={score}>
          { cardsList }
        </CardsUnit>
      ) 
    });
  
    const tableCardsList = tableCards && tableCards.map( (c, index) => {
      return <PlayerCard key={index} rank={c.rank.get()} sign={c.sign.get()} />;
    });
  
    const message = winner ? winner.playerName : `N/A`;
  
    return (
      <div className="App">
        <Grid container>
          { playersList }
        </Grid>
        <CardsUnit playerName="Table" fullWidth>
          { tableCardsList }
        </CardsUnit>

        <div id="stats">
          <p>Cards count: { totalPlayersCardsAmount }</p>
          <p>Winner: { message }</p>
        </div>
      </div>
    );
  }
}

export default inject('gameStore')(observer(App));

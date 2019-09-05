import React from 'react';
import PlayerCard from './Components/PlayerCard';
import CardsUnit from './Components/CardsUnit';
import { observer, inject } from 'mobx-react';
import { Grid } from '@material-ui/core';
import PlayersList from './Components/PlayersList';
import GameTable from './Components/GameTable';

class App extends React.Component {
  render(){
    console.log('App.js props', this.props);
    const { players, tableCards, winner } = this.props.gameStore;
    const message = winner ? winner.playerName : `N/A`;
  
    return (
      <div className="App">
        <Grid container>
          <PlayersList players={players} />
        </Grid>
        <GameTable cards={tableCards} />
      </div>
    );
  }
}

export default inject('gameStore')(observer(App));

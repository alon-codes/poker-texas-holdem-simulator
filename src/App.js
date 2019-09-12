import React from 'react';
import PlayerCard from './Components/PlayerCard';
import CardsUnit from './Components/CardsUnit';
import { observer, inject } from 'mobx-react';
import { Grid } from '@material-ui/core';
import PlayersList from './Components/PlayersList';
import GameTable from './Components/GameTable';
import DuplicateDialog from './Components/DuplicateDialog';
import GameStatuses from './Consts/GameStatuses';

function GameStatus({ gameStatus }) {
  switch(gameStatus){
    case GameStatuses.DUPLICATE_CARD:
      return <DuplicateDialog />;
    default:
      return null;
  }
}

class App extends React.Component {
  render(){
    console.log('App.js props', this.props);
    const { players, tableCards, winner, gameStatus } = this.props.gameStore;
    const message = winner ? winner.playerName : `N/A`;
    return (
      <div className="App">
        <Grid container>
          <Grid item xs={12}>
            <PlayersList gameStatus={gameStatus} players={players} />
            <GameTable cards={tableCards} />
            <GameStatus gameStatus={gameStatus} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default inject('gameStore')(observer(App));

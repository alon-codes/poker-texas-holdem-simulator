import React from 'react';
import { observer, inject } from 'mobx-react';
import { Grid, Snackbar } from '@material-ui/core';
import SnackBarContent from '@material-ui/core/SnackbarContent';
import PlayersList from './Components/PlayersList';
import GameTable from './Components/GameTable';
import GameStatuses from './Consts/GameStatuses';
import { makeStyles } from '@material-ui/styles';

import { amber, green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
}));

function GameStatus({ gameStatus, winner = null, duplicatePlayer = null }) {
  let message = "";
  let className = "";

  switch(gameStatus){
    case GameStatuses.DUPLICATE_CARD:
        message = GameStatuses[gameStatus];
        className= "error";
    break;

    case GameStatuses.DRAW:
        message = GameStatuses[gameStatus];
        className = "info";
    break;

    case GameStatuses.PLAYER_WINNING && !!winner:
        message = ( <span>Winner of this match is<b>{winner.playerName.get()}</b></span> );
        className = "success";
    break;
  }

  const isOpened = gameStatus !== GameStatuses.NONE;

  return (
    isOpened ? (
      <Snackbar open={isOpened}>
        <SnackBarContent  message={message} />
      </Snackbar>
    ) : null
  )
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
              <Grid item xs={12}>
                <PlayersList gameStatus={gameStatus} players={players} />
                <GameTable cards={tableCards} />
                <GameStatus gameStatus={gameStatus} />
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default inject('gameStore')(observer(App));

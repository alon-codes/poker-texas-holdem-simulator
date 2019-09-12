import React from 'react';
import CardsUnit from './CardsUnit';
import PlayerCard from './PlayerCard';
import { inject, observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Stepper, Step, StepContent } from '@material-ui/core';

const renderPlayer = (player, gameStatus) => {
    const cardsList = player.cards.map((card,index) => (
        <Grid item xs={6} key={index}>
            <PlayerCard card={card} playerId={player.id} />
        </Grid>
    ));

    const bestCombination = player.resultSet != null ? player.resultSet.bestCombination : "";
    const isWinner = player.isWinner.get();
    const playerName = player.playerName.get();
    const isHasDuplicateCards = player.isHasDuplicateCards;

    return (
        <CardsUnit isHasDuplicateCards={isHasDuplicateCards} gameStatus={gameStatus} isWinner={isWinner} key={player.id} playerName={playerName} bestCombination={bestCombination}>
            { cardsList }
        </CardsUnit>
    )
}

const PlayersListGridList = ({ gameStore }) => {
    const classes = makeStyles({});
    const players = gameStore.players;
    const gameStatus = gameStore.gameStatus;
    if(!players) return null;

    return (
        <Grid justify="center" container>
                { players.map((p) => renderPlayer(p, gameStatus)) }
        </Grid>
    );
}

export default inject('gameStore')(observer(PlayersListGridList));
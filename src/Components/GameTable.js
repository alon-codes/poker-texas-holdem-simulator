import React from 'react';
import PlayerCard from './PlayerCard';
import Grid from '@material-ui/core/Grid';
import { observer } from 'mobx-react';

function GameTable({ cards }){
    const cardsList = cards.map((card, index) => (
        <Grid key={index} item xs>
            <PlayerCard card={card} playerId={null} />
        </Grid>
    ));

    return (
        <Grid container>
            <Grid item lg={8} md={8} xs={12}>
                <Grid alignItems="center" container>{cardsList}</Grid>
            </Grid>
        </Grid>
    )
}

export default observer(GameTable);
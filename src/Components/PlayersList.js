import React from 'react';
import CardsUnit from './CardsUnit';
import PlayerCard from './PlayerCard';
import { inject, observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';

class PlayersList extends React.Component {
    nextRank = (player, card) => {
        console.log('PlayersList - nextRank', player, card);
        this.props.gameStore.nextRank(player, card);
    }

    prevRank = (player, card) => {
        console.log('PlayersList - prevRank', player, card);
        this.props.gameStore.prevRank(player, card);
    }

    renderPlayer = (player) => {
        const { playerName, cards, id, resultSet } = player;

        const cardsList = cards.map((card,index) => (
            <Grid item xs={6} key={index}>
                <PlayerCard isSelected={card.isHighlighted} card={card} id={card.id} playerId={id} />
            </Grid>
        ));

        const score = resultSet != null ? resultSet.score : "";

        return (
            <CardsUnit key={id} playerName={playerName.get()} score={score}>
                { cardsList }
            </CardsUnit>
        );
    }

    render(){
        const { players } = this.props;
        if(!players) return null;

        return players.map(this.renderPlayer);
    }
}

export default inject('gameStore')(observer(PlayersList));
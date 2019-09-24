import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import { inject, observer } from 'mobx-react';
import SignSwitch from './SignSwitch';
import { CardSigns } from '../Consts/CardSigns';
import SwipeableCard from './SwipeableCard';
import { commonShadowBox, commonMargin } from '../Common/Styles';
import UILockerContainer from '../Components/UILockerContainer';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    signsContainerStyle: {
        paddign: 5,
        backgroundColor: "#fafafa",
        borderRadius: '25px',
        ...commonShadowBox
    },
    playerCard: {
        marginRight: '15px',
        opacity: 1
    },
    disabledCard: {
        opacity: 0.6
    }
})

// TODO: refactor PlayerCard to pure component
function PlayerCard({ gameStore,  playerId, card}) {
    const nextRank = (playerId, card) => gameStore.nextRank(playerId, card);
    const prevRank = (playerId, card) => gameStore.prevRank(playerId, card);
    const changeSign = (playerId, card, nSign) => gameStore.changeSign(playerId, card, nSign);
    const sign = card.sign.get() ? card.sign.get() : CardSigns["CLUBS"];
    const isCardLocked = gameStore.isCardLocked(card);
    const isUILocked = gameStore.isUILocked;

    const classes = useStyles();

    let playerCardsClasses = classes.playerCard;

    if(isCardLocked){
        playerCardsClasses += " " + classes.disabledCard;
    }

    return (
        <UILockerContainer isLocked={isCardLocked}>
            <Grid className={playerCardsClasses} direction="column" container>
                <Grid item xs={12}>
                    <SignSwitch className={classes.signsContainerStyle} sign={sign} onChange={(ns) => changeSign(playerId, card, ns)} />
                </Grid>
                <SwipeableCard isError={isUILocked && !isCardLocked} card={card} nextCallback={() => nextRank(playerId, card)} prevCallback={() => this.prevRank(playerId, card)} />
                <Grid direction="row" justify="space-between" container alignContent="space-between" direction="row">
                    <Grid item xs>
                        <IconButton onClick={() => nextRank(playerId, card)}>
                            <ChevronLeft />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={() => prevRank(playerId, card)}>
                            <ChevronRight />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </UILockerContainer>
    );
}

export default inject('gameStore')(observer(PlayerCard));

PlayerCard.propTypes = {
    // TODO: Validate that card number value between 2-14
    number: PropTypes.number,
    sign: PropTypes.any
}
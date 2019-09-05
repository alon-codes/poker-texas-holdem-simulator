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

const signsContainerStyle = {
    paddign: 5,
    backgroundColor: "#fafafa",
    borderRadius: '25px',
    margin: commonMargin,
    ...commonShadowBox
}

// TODO: refactor PlayerCard to pure component
class PlayerCard extends React.Component {
    nextRank = (playerId, card) => {
        console.log('PlayersList - nextRank', playerId, card);
        this.props.gameStore.nextRank(playerId, card);
    }

    prevRank = (playerId, card) => {
        console.log('PlayersList - prevRank', playerId, card);
        this.props.gameStore.prevRank(playerId, card);
    }

    changeSign = (playerId, card, nSign) => {
        this.props.gameStore.changeSign(playerId, card, nSign);
        console.log('Change sign onChange invoke')
    }

    render(){
        console.log('PlayerCard.js Props', this.props);
        const { card, playerId } = this.props;
        const sign = card.sign.get() ? card.sign.get() : CardSigns["CLUBS"];

        return (
            <Grid direction="column" container>
                <Grid container justify="center" alignContent="space-between" justify="space-between" alignItems="stretch" direction="column">
                    <Grid style={signsContainerStyle} item xs={12}>
                        <SignSwitch sign={sign} onChange={(ns) => this.changeSign(playerId, card, ns)} />
                    </Grid>
                </Grid>
                <SwipeableCard card={card} nextCallback={() => this.nextRank(playerId, card)} prevCallback={() => this.prevRank(playerId, card)} />
                <Grid container justify="space-between" alignContent="stretch" alignItems="center" direction="row">
                    <Grid item xs={12}>
                        <IconButton onClick={() => this.nextRank(playerId, card)}>
                            <ChevronLeft />
                        </IconButton>
                        <IconButton onClick={() => this.prevRank(playerId, card)}>
                            <ChevronRight />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

}

export default inject('gameStore')(observer(PlayerCard));

PlayerCard.propTypes = {
    // TODO: Validate that card number value between 2-14
    number: PropTypes.number,
    sign: PropTypes.any
}
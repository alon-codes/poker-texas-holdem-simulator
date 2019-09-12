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
            <Grid style={{ paddingRight: '20px' }} direction="column" container>
                <Grid item xs={12}>
                    <SignSwitch style={signsContainerStyle} sign={sign} onChange={(ns) => this.changeSign(playerId, card, ns)} />
                </Grid>
                <SwipeableCard card={card} nextCallback={() => this.nextRank(playerId, card)} prevCallback={() => this.prevRank(playerId, card)} />
                <Grid direction="row" justify="space-between" container alignContent="space-between" direction="row">
                    <Grid item xs>
                        <IconButton onClick={() => this.nextRank(playerId, card)}>
                            <ChevronLeft />
                        </IconButton>
                    </Grid>
                    <Grid item>
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
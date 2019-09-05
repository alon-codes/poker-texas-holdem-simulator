import React from 'react';
import CardRanks from '../Consts/CardRanks';
import { CardSigns } from '../Consts/CardSigns';
import Grid from '@material-ui/core/Grid';
import { useSwipeable, Swipeable } from 'react-swipeable';
import { commonShadowBox, commonMargin } from '../Common/Styles';

const containerStyle = {
    margin: commonMargin
}

const cardStyles = {
    margin: "0px auto",
    borderRadius: "23px",
    overflow: "hidden",
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    paddingTop: '150.43%',
    marginTop: commonMargin,
    ...commonShadowBox
};

const selectedCardStyle = {
    border: "7px #FF5733 solid"
};

export default function SwipeableCard({ card, nextCallback, prevCallback }){

    // TODO: utilize nextCallback/prevCallback with our Swipealbe component

    const rank = card.rank.get() ? card.rank.get() : 2;
    const sign = card.sign.get() ? card.sign.get() : CardSigns["CLUBS"];
    const isSelected = card.isHighlighted.get();

    const rankValue = CardRanks[rank];
    const cardUrl = `/cards/${rankValue}${sign}.png`;

    let styles = Object.assign( {...cardStyles} , {
        backgroundImage: `url(${cardUrl})`
    });

    if(isSelected){
        styles = Object.assign(styles, ...selectedCardStyle);
    }

    return (
        <Grid container alignItems="stretch">
            <Grid style={{ position: 'relative' }} item xs>
                <Swipeable onSwipedLeft={prevCallback} onSwipedRight={nextCallback} onSwipedUp={nextCallback} onSwipedDown={prevCallback}>
                    <div style={styles}></div>
                </Swipeable>
            </Grid>
        </Grid>
    )
}
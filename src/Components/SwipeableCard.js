import React from 'react';
import CardRanks from '../Consts/CardRanks';
import { CardSigns } from '../Consts/CardSigns';
import Grid from '@material-ui/core/Grid';
import { useSwipeable, Swipeable } from 'react-swipeable';
import { commonShadowBox, commonMargin } from '../Common/Styles';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import { Box } from '@material-ui/core';
import { errorColor } from '../Common/Colors';
import { observer } from 'mobx-react';

const containerStyle = {
    margin: commonMargin
}

const cardStyles = {
    margin: "0px auto",
    borderRadius: "6.5%",
    overflow: "hidden",
    backgroundColor: "#fff",
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    paddingTop: '150.43%',
    marginTop: commonMargin,
    ...commonShadowBox
};
const errorCardStyle = {
    borderColor: errorColor
}

function SwipeableCard({ card, nextCallback, prevCallback, isError = false }){

    // TODO: utilize nextCallback/prevCallback with our Swipealbe component

    const rank = card.rank.get() ? card.rank.get() : 2;
    const sign = card.sign.get() ? card.sign.get() : CardSigns["CLUBS"];
    const isSelected = card.isHighlighted.get();

    const rankValue = CardRanks[rank];
    const cardUrl = `/cards/${rankValue}${sign}.png`;

    let styles = Object.assign(
        { ...cardStyles },
        { backgroundImage: `url(${cardUrl})` },
        isError ? {...errorCardStyle} : {}
    );

    return (
        <Grid disabled container>
            <Grid item xs={12}>
                <div style={{ position: 'relative', width: '100%' }}>
                    <Swipeable onSwipedLeft={prevCallback} onSwipedRight={nextCallback} onSwipedUp={nextCallback} onSwipedDown={prevCallback}>
                        <div style={styles}>
                            { /* <Box style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} alignItems="center" justify="space-between" flexDirection="column">
                                <Box style={{ width: '100%' }} direction="row" justify="space-between" alignContent="space-between" direction="row">
                                    <IconButton>
                                        <ChevronLeft />
                                    </IconButton>
                                    <IconButton>
                                        <ChevronRight />
                                    </IconButton>
                                </Box>
    </Box> */}
                        </div>
                    </Swipeable>
                </div>
            </Grid>
        </Grid>
    )
}

export default observer(SwipeableCard);
import React from 'react';
import PropTypes from 'prop-types';
import { CardSigns } from '../Models/CardSigns';
import { CardRanks } from '../Models/CardRanks';
import Grid from '@material-ui/core/Grid';

const cardStyles = {
    width: "100%",
    margin: 10
};

const selectedCardStyle = {
    border: "7px #FF5733 solid",
    borderBottomLeftRadius: "15px",
    borderBottomRightRadius: "15px",
    borderTopLeftRadius: "15px",
    borderTopRightRadius: "15px"
};

export default function PlayerCard({rank, sign, isSelected}){
    const rankValue = CardRanks[rank];
    const cardUrl = `/cards/${rankValue}${sign}.png`;

    let styles = {...cardStyles};
    
    if(isSelected){
        styles = {...cardStyles, ...selectedCardStyle};
    }

    return (
        <Grid item xs={6} sm={4} md={2}>
        <img style={styles} src={cardUrl} alt="" />
       </Grid>
    );
};

PlayerCard.propTypes = {
    // TODO: Validate that card number value between 2-14
    number: PropTypes.number,
    sign: PropTypes.any
}
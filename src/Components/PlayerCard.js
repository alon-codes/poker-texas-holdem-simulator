import React from 'react';
import PropTypes from 'prop-types';
import { CardSigns } from '../Models/CardSigns';
import { CardRanks } from '../Models/CardRanks';

const cardStyles = {
    maxWidth: 150,
    margin: 20
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
       <img style={styles} src={cardUrl} alt="" />
    );
};

PlayerCard.propTypes = {
    // TODO: Validate that card number value between 2-14
    number: PropTypes.number,
    sign: PropTypes.any
}
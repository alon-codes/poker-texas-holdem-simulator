import React from 'react';
import Button from '@material-ui/core/IconButton';
import { CardSigns } from '../Consts/CardSigns';
import { ButtonBase, Grid } from '@material-ui/core';
import * as Colors from '../Common/Colors';

const defaultsignBtnStyles = {
    backgroundColor: "#fafafa",
    width: '4vw',
    height: '4vw',
    maxWidth: '100%',
    borderRadius: '50%',
    backgroundSize: 'auto 65%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
}

const selectedBtnStyle = {
    backgroundColor: Colors.selectedSignBgColor
};

const cardSignsArr = Object.keys(CardSigns).map(sign => CardSigns[sign]);

export default function SignSwitch({sign, onChange}){
    const signList = cardSignsArr.map((currentSign) => {
        const isSelected = currentSign == sign;

        const disabledStyle = isSelected ? selectedBtnStyle : {};

        const style = {
            ...defaultsignBtnStyles,
            ...disabledStyle,
            backgroundImage: `url(/signs/${currentSign}.png)`
        }

        /* <button key={currentSign} disabled={disabled} style={style}  /> */

        return (
            <button key={currentSign} style={style}  disabled={isSelected} onClick={() => onChange(currentSign)} />
        )
    });
    return (
        <Grid style={{ padding: '5px' }} container justify="space-between" alignContent="center">
            { signList }
        </Grid>
    )
}
import React from 'react';
import Button from '@material-ui/core/IconButton';
import { CardSigns } from '../Consts/CardSigns';

const defaultsignBtnStyles = {
    backgroundColor: "#fafafa"
}

const selectedBtnStyle = {
    backgroundColor: "#ffebee"
};

const signImageStyle = {
    maxHeight: '30px'
}

const cardSignsArr = Object.keys(CardSigns).map(sign => CardSigns[sign]);

export default function SignSwitch({sign, onChange}){
    const signList = cardSignsArr.map((currentSign) => {
        const isSelected = currentSign == sign;

        const disabledStyle = isSelected ? selectedBtnStyle : {};

        const style = {
            ...defaultsignBtnStyles,
            ...disabledStyle
        }

        /* <button key={currentSign} disabled={disabled} style={style}  /> */

        return (
            <Button style={style} key={currentSign} disabled={isSelected} onClick={() => onChange(currentSign)}>
                <img src={`/signs/${currentSign}.png`} style={signImageStyle} />
            </Button>
        )
    });
    return (
        <React.Fragment>
            { signList }
        </React.Fragment>
    )
}
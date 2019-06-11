import React from 'react';

const cardsUnitStyle = {
    border: "1px #000 solid",
    padding: 20,
    backgroundColor: "#FFC300",
    width: "500px",
    marginRight: 20
}


export default function CardsUnit({ playerName, children }){
    return (
        <React.Fragment>
            <h6>{playerName}</h6>
            <div style={cardsUnitStyle}>
                {children}
            </div>
        </React.Fragment>
    )
}
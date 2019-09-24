import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import GameScoresTexts from '../Consts/GameScoresTexts';
import { observer } from 'mobx-react';
import { winnerTextColor, winnerTextBgColor } from '../Common/Colors';
import GameStatuses from '../Consts/GameStatuses';

const useStyles = makeStyles({
    root: {
        
    },
    statusText: {
        padding: '5px'
    },
    winnerText: {
        color: winnerTextColor,
        backgroundColor: winnerTextBgColor,
    },
    duplicateText: {
        color: 'yellow'
    },
    bestCombination: {
        marginBottom: '5px'
    },
    cardsUnit: {
        padding: '15px',
        border: '1px #000 solid'
    }
});

function PlayerStatus({ gameStatus, isWinner = false, isHasDuplicateCards }){
    const classes = useStyles();
    let colorStyling = [classes.statusText];

    switch(gameStatus){
        case GameStatuses.PLAYER_WINNING && isWinner:
            colorStyling.push(classes.winnerText);
        break;
        case GameStatuses.DRAW:
            colorStyling.push(classes.drawText);
        break;
        case GameStatuses.DUPLICATE_CARD && isHasDuplicateCards:
            colorStyling.push(classes.duplicateText);
        break;
    }   
    return <span className={colorStyling}>{GameStatuses[gameStatus]}</span>;
}

function CardsUnit({playerName, children, bestCombination, isHasDuplicateCards = false, isWinner = false, gameStatus = GameStatuses.NONE }){
    const classes = useStyles();
    
    return (
            <Grid className={classes.cardsUnit} item xs={12} md={4} sm={6} lg={3}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="h3">{playerName}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        { bestCombination ? (
                            <Typography className={classes.bestCombination} variant="h5">
                                { GameScoresTexts[bestCombination] }
                            </Typography>
                        ) : null }
                        { gameStatus ? (
                            <PlayerStatus gameStatus={gameStatus} isWinner={isWinner} isHasDuplicateCards={isHasDuplicateCards} />
                        ) : null }
                    </Grid>  
                </Grid>
                <Grid alignContent="center" justify="center" container>
                    { children }
                </Grid>
            </Grid>
    )
}

export default observer(CardsUnit);
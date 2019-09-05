import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import GameScoresTexts from '../Consts/GameScoresTexts';
import { observer } from 'mobx-react';

const useStyles = makeStyles({
    root: {
        
    }
});

function CardsUnit({ playerName, children, score, fullWidth = false }){
    const classes = useStyles();
    const sm = fullWidth ? 6 : 6;
    const md = fullWidth ? 3 : 3;
    const lg = fullWidth ? 3 : 3;
    
    return (
        <Grid lg={lg} item md={md} sm={sm} xs={12} className="card-unit">
            <Grid container>
                <Grid container>
                    <Typography variant="h3">{playerName}</Typography>
                </Grid>    
                <Grid container>
                    { score ? <Typography variant="h5">{ GameScoresTexts[score] }</Typography> : null }                
                </Grid>     
            </Grid>
            <Grid container>
                {children}
            </Grid>
        </Grid>
    )
}

export default observer(CardsUnit);
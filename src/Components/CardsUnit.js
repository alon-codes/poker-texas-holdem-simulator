import React from 'react';
import { Card, CardTitle, CardActions } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import GameScoresTexts from '../Models/GameScoresTexts';

const useStyles = makeStyles({
    root: {
        
    }
});

export default function CardsUnit({ playerName, children, score, fullWidth = false }){
    const classes = useStyles();
    const sm = fullWidth ? 12 : 6;
    const md = fullWidth ? 12 : 6;
    
    return (
        <Grid item md={md} sm={sm} xs={12} className="card-unit">
            <Grid container>
                <Grid container>
                    <Typography variant="h3">{playerName}</Typography>
                </Grid>    
                <Grid container>
                    { score ? <Typography variant="h5">{ GameScoresTexts[score] }</Typography> : null }                
                </Grid>     
            </Grid>
            <Grid spacing={2} alignItems="center" container>
                {children}
            </Grid>
        </Grid>
    )
}
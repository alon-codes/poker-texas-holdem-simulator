import React from 'react';
import { Card, CardTitle, CardActions } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        
    }
});

export default function CardsUnit({ playerName, children }){
    const classes = useStyles();
    return (
        <Card>
            <CardContent>
                <Grid container>
                    <Typography variant="h3">{playerName}</Typography>
                    <Fab color="primary" aria-label="Add" className={classes.fab}>
                        <AddIcon />
                    </Fab>
                </Grid>
                <Grid container>
                {children}
                </Grid>
            </CardContent>
        </Card>
    )
}
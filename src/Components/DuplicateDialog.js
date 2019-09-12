import React, { useState } from 'react';
import { observer, inject } from 'mobx-react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';
import PlayerCard from '../Components/PlayerCard';
import Error from '@material-ui/icons/Error';

function DuplicateDialog({ gameStore }){
    const duplicatePlayer = gameStore.duplicatePlayer;
    const duplicateCard = duplicatePlayer && duplicatePlayer.duplicateCard;

    const [isOpened, setIsOpened] = useState(true);
    const closeModal = () => setIsOpened(false);

    if(!duplicateCard){
        return null;
    }

    return (
        <Dialog maxWidth="md" fullWidth={true} aria-labelledby="simple-dialog-title" open={true}>
            <DialogTitle>Change duplicate card</DialogTitle>
            <DialogContent dividers>
                <Grid container justify="center">
                    <Grid item xs={12} sm={6} md={4}>
                         <PlayerCard playerId={duplicatePlayer.id} card={duplicateCard} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Box style={{ width: '100%' }} justify="flex-start" alignContent="flex-start" flexDirection="column">
                    <Error color="error" />
                    <Typography paragraph>The calculator can't calcualte results when card is duplicated</Typography>
                </Box>
            </DialogActions>
        </Dialog>
    )
}

export default inject('gameStore')(observer(DuplicateDialog))
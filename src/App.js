import React from 'react';
import { CardSigns } from './Models/CardSigns';
import { CardRanks } from './Models/CardRanks';
import PlayerCard from './Components/PlayerCard';
import CardsUnit from './Components/CardsUnit';

import GameStore from './Stores/GameStore';
import { inject, observer } from 'mobx-react';

function App({gameStore}) {
  const { players, tableCards, winner } = gameStore;

  const playersList = players.map( ({playerName,cards,id}) => {
    console.log(cards);

    const cardsList = cards.map((c, index) => <PlayerCard key={index} rank={c.rank.get()} sign={c.sign.get()} />);

    console.log(cardsList);

    return (
      <CardsUnit key={id} playerName={playerName.get()}>
        { cardsList }
      </CardsUnit>
    ) 
  });

  const tableCardsList = tableCards.map( (c, index) => {
    return <PlayerCard key={index} rank={c.rank.get()} sign={c.sign.get()} />;
  });

  return (
    <div className="App">
      { playersList }
      <CardsUnit playerName="Table">
        { tableCardsList }
      </CardsUnit>
      <p>{winner ? winner.playerName : `Add more cards to see `}</p>
    </div>
  );
}

export default inject('gameStore')(observer(App));

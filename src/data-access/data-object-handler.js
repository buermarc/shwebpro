'use strict';

import Game from './data-objects/game.js';
import GameRound from './data-objects/game-round.js';
import Player from './data-objects/player.js';
import GameToGameRound from './data-objects/game-to-game-round.js';
import PlayerToGame from './data-objects/player-to-game.js';
import PlayerToGameRound from './data-objects/player-to-game-round.js';

class DataObjectHandler {
  constructor() {
    let game = new Game(1,'Marc',2,3,4);
    localStorage.setItem('a', game.toJson);
    console.log(localStorage.getItem('a'));
  }

}

export default DataObjectHandler;

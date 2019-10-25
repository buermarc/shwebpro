'use strict';

import Game from './data-objects/game.js';
import GameRound from './data-objects/game-round.js';
import Player from './data-objects/player.js';
import GameToGameRound from './data-objects/game-to-game-round.js';
import PlayerToGame from './data-objects/player-to-game.js';
import PlayerToGameRound from './data-objects/player-to-game-round.js';
import db from './database-handler.js'

class DataObjectHandler {
  constructor() {
    let test = async () => {
      Game.clear();
      let database = db.database;
      let game = new Game('Marc', 2, 3, 4);
      console.log(database.game);
      let result = await database.game.where('gameName').equals('Marc').toArray();
      console.log(result);
      let arr = await Game.getAll();
      console.log(arr);

    }
    test();
  }
  async initData() {
    let games = [];
    let players = [];

    //game.clear();
    let arr = await Game.getAll();
    if (arr.length < 1) {
      let game = new Game('Doppelkopf', 2, 3, 4);
      let game2 = new Game('Mau-Mau', 4, 5, 6);
      game.saveNew;
      game2.saveNew;
    }

    arr = await Player.getAll();
    if (arr.length < 1) {
      let player1 = new Player('Lasse');
      let player2 = new Player('Karin');
      let player3 = new Player('Josia');
      let player4 = new Player('Marc');
      player1.saveNew();
      player2.saveNew();
      player3.saveNew();
      player4.saveNew();
    }

    arr = await GameRound.getAll();
    if (arr.length < 1) {
    }

    arr = await GameToGameRound.getAll();
    if (arr.length < 1) {
    }

    arr = await PlayerToGame.getAll();
    if (arr.length < 1) {
    }

    arr = await PlayerToGameRound.getAll();
    if (arr.length < 1) {
    }
  }

}

export default DataObjectHandler;

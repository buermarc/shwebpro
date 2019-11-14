'use strict';

import Game from './data-objects/game.js';
import GameRound from './data-objects/game-round.js';
import Player from './data-objects/player.js';
import GameToGameRound from './data-objects/game-to-game-round.js';
import PlayerToGame from './data-objects/player-to-game.js';
import PlayerToGameRound from './data-objects/player-to-game-round.js';
import db from './database-handler.js'

class DataObjectHandler {

  constructor(initData) {
    if (initData) {
      this._initData();
    }
  }




  async getAllGames() {
    //TODO check if await is necessary
    return await Game.getAll();
  }

  async getAllPlayers() {
    return await Player.getAll();
  }
  //============Josia=================================

  async getOpenRoundsByGameId(id) {
    let rounds = await db.database.gameToGameRound.where({
      gameId: id
    }).toArray();
    rounds = rounds.map(x => {
      return x.gameRoundId;
    });

    return await db.database.gameRound.filter((gameRound) => {
      //if gameRoundIf belongs to gameId
      return (rounds.includes(gameRound.id) && gameRound.fin == false);
    }).toArray();
  }

  async getAllPlayerOfGameRoundId(id) { //Auch Lasse
    return await db.database.playerToGameRound.where({
      gameRoundId: id
    }).toArray();
  }

  //deprecate
  async getAllPlayerOfGameRoundIdWithNames(id) {
    let arr = this.getAllPlayerOfGameRoundId(id);
    let playerNames = Player.getAll();
    //TODO add playerName to Json Object and return
  }

  //neuer spieler anlegen
  async setNewPlayer(playerName) {
    let check = await db.database.player.where({
      playerName: playerName
    }).toArray();
    if (check.length != 0) {
      throw 'Name ' + playerName + ' may already exists or is double';
    } else {
      let player = new Player(playerName);
      player.saveNew();
      return player.asJson;
    }
  }

  //neue spieleRunde gameId, playerId[], round. fin
  async setNewGameRoundWithPlayers(gameId, playerIds) {
    if (Array.isArray(playerIds)) {
      //create new gameRound with gameId, inital round 0 and fin false
      let zeroRounds = 0;
      let gameRound = new GameRound(zeroRounds, false, Date.now());
      gameRound.saveNew();
      let gameRoundId = await gameRound.getId();

      //create new game-to-game-round
      let gameToGameRound = new GameToGameRound(gameId, gameRoundId);
      gameToGameRound.saveNew();

      //for each player create player to game round with playerId and gameRoundId
      playerIds.forEach(playerId => {
        //inital points for each player is 0
        let playerToGameRound = new PlayerToGameRound(playerId, gameRoundId, 0);
        playerToGameRound.saveNew();
      });
    } else {
      throw 'playerId is not an array';
    }
  }


  //===============================================

  //=========Marc============================================
  async getGameRoundByPlayerIdAndGameId(playerId, gameId) {
    let result = db.database.playerToGame.where({
      playerId: playerId,
      gameId: gameId
    }).toArray();
    if (!result == 1) {
      throw 'Array longer then 1';
    } else {
      return result;
    }
  }

  async getGameRoundByGameId(id) {
    return db.database.playerToGame.where({gameId: id}).toArray();
  }

  async getGameRoundByPlayerId(id) {
    return db.database.playerToGame.where({playerId:  id}).toArray();
  }

  async getPlayerById(id) {
    return Player.getById(id);
  }

  async getGameById(id) {
    return Game.getById(id);
  }
  //==========================================================


  //=============Lasse========================================

  //get gameRound by id to get rounds and for (var
  async getGameRoundById(gameRoundId) {
    return GameRound.getById(gameRoundId);
  }

  // update points of player in gameRound
  async updatePointsByPlayerIdAndGameRoundId(playerId, gameRoundId, newPoints) {
    let playerToGameRound = new PlayerToGameRound(playerId, gameRoundId, newPoints);
    return db.database.playerToGameRound.put(playerToGameRound.asJson);
  }

  //==========================================================
  //Mock Daten zum testen
  async _initData() {
    let games = [];
    let players = [];

    //game.clear();
    // Player.clear();
    let game1 = new Game('Doppelkopf', 2, 3, 4);
    let game2 = new Game('Mau-Mau', 4, 5, 6);


    let arr = await Game.getAll();
    if (arr.length < 1) {
      console.log('Game Data Init');
      game1.saveNew();
      game2.saveNew();
    }
    arr = await Game.getAll();
    console.log(arr);
    let game1Id = await game1.getId();
    let game2Id = await game2.getId();


    let player1 = new Player('Lasse');
    let player2 = new Player('Karin');
    let player3 = new Player('Josia');
    let player4 = new Player('Marc');


    arr = await Player.getAll();
    if (arr.length < 1) {
      console.log('Player Data Init');
      player1.saveNew();
      player2.saveNew();
      player3.saveNew();
      player4.saveNew();
    }
    arr = await Player.getAll();
    console.log(arr);
    let player1Id = await player1.getId();
    let player2Id = await player2.getId();
    let player3Id = await player3.getId();
    let player4Id = await player4.getId();
    console.log(player4Id);
    console.log(await Player.getById(player4Id));

    arr = await GameRound.getAll();
    //take care date will make them not the ones in the db
    let gameRound1 = new GameRound(1, false, Date.now());
    let gameRound2 = new GameRound(3, false, Date.now());
    if (arr.length < 1) {
      console.log('GameRound Data Init');
      gameRound1.saveNew();
      gameRound2.saveNew();
    }
    arr = await GameRound.getAll();
    console.log(arr);
    let gameRound1Id = arr[0].id;
    let gameRound2Id = arr[1].id;

    arr = await GameToGameRound.getAll();
    let gameToGameRound1 = new GameToGameRound(game1Id, gameRound1Id);
    let gameToGameRound2 = new GameToGameRound(game2Id, gameRound2Id);
    if (arr.length < 1) {
      console.log('GameToGameRound Data Init');
      gameToGameRound1.saveNew();
      gameToGameRound2.saveNew();
    }
    arr = await GameToGameRound.getAll();
    console.log(arr);

    arr = await PlayerToGame.getAll();
    let playerToGame1 = new PlayerToGame(player1Id, game1Id, 10, 9);
    let playerToGame2 = new PlayerToGame(player1Id, game2Id, 4, 99);
    let playerToGame3 = new PlayerToGame(player2Id, game1Id, 8, 2);
    let playerToGame4 = new PlayerToGame(player2Id, game2Id, 7, 7);
    let playerToGame5 = new PlayerToGame(player3Id, game1Id, 4, 3);
    let playerToGame6 = new PlayerToGame(player3Id, game2Id, 6, 0);
    let playerToGame7 = new PlayerToGame(player4Id, game1Id, 0, 0);
    let playerToGame8 = new PlayerToGame(player4Id, game2Id, -1, 2020202020);
    if (arr.length < 1) {
      console.log('PlayerToGame Data Init');
      playerToGame1.saveNew();
      playerToGame2.saveNew();
      playerToGame3.saveNew();
      playerToGame4.saveNew();
      playerToGame5.saveNew();
      playerToGame6.saveNew();
      playerToGame7.saveNew();
      playerToGame8.saveNew();
    }
    // playerToGame7.delete(); TODO
    arr = await PlayerToGame.getAll();
    console.log(arr);

    arr = await PlayerToGameRound.getAll();
    let playerToGameRound1 = new PlayerToGameRound(player1Id, gameRound1Id, 20);
    let playerToGameRound2 = new PlayerToGameRound(player1Id, gameRound2Id, 99);
    let playerToGameRound3 = new PlayerToGameRound(player2Id, gameRound1Id, -20);
    let playerToGameRound4 = new PlayerToGameRound(player2Id, gameRound2Id, 80);
    let playerToGameRound5 = new PlayerToGameRound(player3Id, gameRound1Id, 90);
    if (arr.length < 1) {
      console.log('PlayerToGameRound Data Init');
      playerToGameRound1.saveNew();
      playerToGameRound2.saveNew();
      playerToGameRound3.saveNew();
      playerToGameRound4.saveNew();
      playerToGameRound5.saveNew();
    }
    arr = await PlayerToGameRound.getAll();
    console.log(arr);

    arr = await this.getOpenRoundsByGameId(game2Id);
    console.log(arr);

    arr = await this.getAllPlayerOfGameRoundId(gameRound1Id);
    console.log(arr);

    try {
      console.log(await this.setNewPlayer('Jakobus'));
    } catch (e) {
      console.log(e);
    }
    arr = await Player.getAll();
    console.log(arr);
    let playerIdArr = arr.map(x => {
      return x.id
    });
    console.log(Array.isArray(playerIdArr));
    arr = await PlayerToGameRound.getAll();
    console.log(arr);

    // this.setNewGameRoundWithPlayers(gameRound2Id, playerIdArr);

    arr = await PlayerToGameRound.getAll();
    console.log(arr);

    //console.log(await this.updatePointsByPlayerIdAndGameRoundId(1, 1, 900));
    console.log(await this.getGameRoundById(2));
  }

}

export default DataObjectHandler;

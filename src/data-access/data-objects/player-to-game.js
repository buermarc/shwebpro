'use strict';

import db from './../database-handler.js'
let database = db.database;

class PlayerToGame {
  constructor(playerId, gameId, win, lose) {
    // this._id = id;
    this._playerId = playerId;
    this._gameId = gameId;
    this._win = win;
    this._lose = lose;
  }

  get asJson() {
    return {
      // id: this._id,
      playerId: this._playerId,
      gameId: this._gameId,
      win: this._win,
      lose: this._lose,
    }
  }
  static async getAll() {
    let result = await database.playerToGame.filter(() => {
      return true
    });
    return result.toArray();
  }
  static async getById(id) {
    return database.playerToGame.get(id);
  }
  async delete() {
    return database.playerToGame.where(this.asJson).delete();
  }
  static async clear() {
    return database.playerToGame.clear();
  }
  async saveNew() {
    return database.playerToGame.add(this.asJson);
  }
  async update() {
    return database.playerToGame.put(this.asJson);
  }
  async getId() {
    let res = await database.playerToGame.
    where(this.asJson).toArray();
    if (res.length == 0) {
      console.log('No such entry');
    } else if (res.length == 1) {
      return res[0].id;
    } else {
      throw ('This oject: ' + this.asJson + ' is not unique\n array has the length: ' +
        res.length + '\n ' + res);
    }
  }
  async search(query) {
    //TODO
  }
}
export default PlayerToGame;

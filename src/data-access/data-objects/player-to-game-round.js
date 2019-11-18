'use strict';

import db from './../database-handler.js'
let database = db.database;

class PlayerToGameRound {
  constructor(playerId, gameRoundId, points) {
    // this._id = id;
    this._playerId = playerId;
    this._gameRoundId = gameRoundId;
    this._points = points;
  }

  get asJson() {
    return {
      // id: this._id,
      playerId: this._playerId,
      gameRoundId: this._gameRoundId,
      points: this._points,
    }
  }
  static async getAll() {
    let result = await database.playerToGameRound.filter(() => {
      return true
    });
    return result.toArray();
  }
  static async getById(id) {
    return database.playerToGameRound.get(id);
  }
  static async delete(id) {
    return database.playerToGameRound.delete(id);
  }
  static async clear() {
    return database.playerToGameRound.clear();
  }
  async saveNew() {
    return database.playerToGameRound.add(this.asJson);
  }
  async update() {
    return database.playerToGameRound.put(this.asJson);
  }
  async getId() {
    let res = await database.playerToGameRound.
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

export default PlayerToGameRound;

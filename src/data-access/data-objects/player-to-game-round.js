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
  static async delete() {
    return database.playerToGameRound.delete(this.asJson);
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
  async getId() {}
  async search(query) {
    //TODO
  }
}

export default PlayerToGameRound;

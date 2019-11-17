'use strict'

import db from './../database-handler.js'
let database = db.database;

class GameToGameRound {
  //TODO: Should id be [gameId+gameRoundId] or standard id like all the other?
  constructor(gameId, gameRoundId) {
    // this._id = id;
    this._gameId = gameId;
    this._gameRoundId = gameRoundId;
  }

  get asJson() {
    return {
      // id: this._id,
      gameId: this._gameId,
      gameRoundId: this._gameRoundId,
    }
  }

  static async getAll() {
    let result = await database.gameToGameRound.filter(() => {
      return true
    });
    return result.toArray();
  }
  static async getById(id) {
    return database.gameToGameRound.get(id);
  }
  static async delete(id) {
    return database.gameToGameRound.delete(id);
  }
  static async clear() {
    return database.gameToGameRound.clear();
  }
  async saveNew() {
    return database.gameToGameRound.add(this.asJson);
  }
  async update() {
    return database.gameToGameRound.put(this.asJson);
  }
  async getId() {}
  async search(query) {
    //TODO
  }
}

export default GameToGameRound;

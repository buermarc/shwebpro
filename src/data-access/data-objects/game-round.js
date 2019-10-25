'use strict';

import db from './../database-handler.js'
let database = db.database;

class GameRound {
  constructor(round, fin) {
    // this._id = id;
    this._round = round;
    this._fin = fin;
  }

  get asJson() {
    return {
      // id: this._id,
      round: this._round,
      fin: this._fin,
    }
  }
  static async getAll() {
    let result = await database.gameRound.filter(() => {return true});
    return result.toArray();
  }
  static async clear() {
    return database.gameRound.clear();
  }
  async saveNew() {
    return database.gameRound.add(this.asJson);
  }
  async update() {
    return database.gameRound.put(this.asJson);
  }
  async delete() {
    return database.gameRound.delete(this.asJson);
  }
  async getById(id) {
    return database.gameRound.get(id)
  }
}

export default GameRound;

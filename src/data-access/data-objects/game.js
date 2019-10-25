'use strict';

import db from './../database-handler.js'
let database = db.database;

class Game {
  //TODO: data-handler has to take care that id will be unique and matches the
  //      index of the array the object is stored
  constructor(name, maxRounds, minPlayers, maxPlayers) {
    // this._id = id;
    this._gameName = name;
    this._maxRounds = maxRounds;
    this._minPlayers = minPlayers;
    this._maxPlayers = maxPlayers;
  }

  get asJson() {
    return {
      // id: this._id,
      gameName: this._gameName,
      maxRounds: this._maxRounds,
      minPlayers: this._minPlayers,
      maxPlayers: this._maxPlayers,
    }
  }
  static async getAll() {
    let result = await database.game.filter(() => {return true});
    return result.toArray();
  }
  static async clear() {
    return database.game.clear();
  }
  async saveNew() {
    return database.game.add(this.asJson);
  }
  async update() {
    return database.game.put(this.asJson);
  }
  async delete() {
    return database.game.delete(this.asJson);
  }
  async getById(id) {
    return database.game.get(id);
  }
  async search(query) {
    //TODO
  }
}

export default Game;

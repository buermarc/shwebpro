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
    let result = await database.game.filter(() => {
      return true
    });
    return result.toArray();
  }
  static async getById(id) {
    return database.game.get(id);
  }
  static async delete(id) {
    return database.game.delete(id);
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
  async getId() {
    let res = database.game.
    where('gameName', 'maxRounds', 'minPlayers', 'maxPlayers').
    equals(this._gameName, this._maxRounds, this._minPlayers, this._maxPlayers);
    res = await res.toArray();
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

export default Game;

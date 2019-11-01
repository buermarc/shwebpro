'use strict'

import db from './../database-handler.js'
let database = db.database;

class Player {
  constructor(playerName) {
    // this._id = id;
    this._playerName = playerName;
  }

  get asJson() {
    return {
      // id: this._id,
      playerName: this._playerName,
    }
  }
  static async getAll() {
    let result = await database.player.filter(() => {
      return true
    });
    return result.toArray();
  }
  static async getById(id) {
    return database.player.get(id);
  }
  static async delete() {
    return database.player.delete(this.asJson);
  }
  static async deleteById(id) {
    return database.player.delete(id);
  }
  static async clear() {
    return database.player.clear();
  }
  async saveNew() {
    return database.player.add(this.asJson);
  }
  async update() {
    return database.player.put(this.asJson);
  }
  async getId() {
    let res = database.player.
    where('playerName').
    equals(this._playerName);
    res = await res.toArray();

    if (res.length == 0) {
      console.log('No such entry');
    } else if (res.length == 1) {
      return res[0].id;
    } else {
      throw ('playerName: ' + this._playerName + ' is not unique\n array has the length: ' + res.length +
        '\n ' + res);
    }
  }
  async search(query) {
    //TODO
  }
}

export default Player;

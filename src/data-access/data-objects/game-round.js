'use strict';

import db from './../database-handler.js'
let database = db.database;

class GameRound {
  constructor(round, fin, date) {
    // this._id = id;
    this._round = round;
    this._fin = fin;
    this._date = date;
  }

  get asJson() {
    return {
      // id: this._id,
      round: this._round,
      fin: this._fin,
      date: this._date,
    }
  }
  static async getAll() {
    let result = await database.gameRound.filter(() => {
      return true
    });
    return result.toArray();
  }
  static async getById(id) {
    return database.gameRound.get(id);
  }
  static async delete() {
    return database.gameRound.delete(this.asJson);
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
  async getId() {
    let res = await database.gameRound.where(this.asJson).toArray;
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

export default GameRound;

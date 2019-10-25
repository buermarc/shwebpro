'use strict'

import db from './../database-handler.js'
let database = db.database;

class Player {
  constructor(name) {
    // this._id = id;
    this._name = name;
  }

  get asJson() {
    return {
      // id: this._id,
      name: this._name,
    }
  }
  static async getAll() {
    let result = await database.player.filter(() => {return true});
    return result.toArray();
  }
  static async delete() {
    return database.player.delete(this.asJson);
  }
  async saveNew() {
    return database.player.add(this.asJson);
  }
  async update() {
    return database.player.put(this.asJson);
  }
  async clear() {
    return database.player.clear();
  }
  async getById(id) {
    return database.player.get(id);
  }
  async search(query) {
    //TODO
  }
}

export default Player;

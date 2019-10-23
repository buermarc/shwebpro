'use strict'

class Player {
  constructor(id, name) {
    this._id = id;
    this._name = name;
  }

  get asJson() {
    return {
      id: this._id,
      name: this._name,
    }
  }
}

export default Player;

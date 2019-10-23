'use strict';

class Game {
  //TODO: data-handler has to take care that id will be unique and matches the
  //      index of the array the object is stored
  constructor(id, name, maxRounds, minPlayers, maxPlayers) {
    this._id = id;
    this._name = name;
    this._maxRounds = maxRounds;
    this._minPlayers = minPlayers;
    this._maxPlayers = maxPlayers;
  }

  get asJson() {
    return {
      id: this._id,
      name: this._name,
      maxRounds: this._maxRounds,
      minPlayers: this._minPlayers,
      maxPlayers: this._maxPlayers,
    }
  }
}

export default Game;

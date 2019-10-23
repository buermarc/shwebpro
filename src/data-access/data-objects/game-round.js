'use strict';

class GameRound {
  constructor(id, round, fin) {
    this._id = id;
    this._round = round;
    this._fin = fin;
  }

  get asJson() {
    return {
      id: this._id,
      round: this._round,
      fin: this._fin,
    }
  }
}

export default GameRound;

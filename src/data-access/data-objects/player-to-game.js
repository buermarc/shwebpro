'use strict';

class PlayerToGame {
  constructor(id, playerId, gameId, win, lose) {
    this._id = id;
    this._playerId = playerId;
    this._gameId = gameId;
    this._win = win;
    this._lose = lose;
  }

  get asJson() {
    return {
        id: this._id,
        playerId: this._playerId,
        gameId: this._gameId,
        win: this._win,
        lose: this._lose,
    }
  }
}
export default PlayerToGame;

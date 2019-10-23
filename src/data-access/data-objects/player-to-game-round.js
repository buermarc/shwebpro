'use strict';

class PlayerToGameRound {
  constructor(id, playerId, gameRoundId, points) {
    this._id = id;
    this._gameRoundId = gameRoundId;
    this._points = points;
  }

  get asJson() {
    return {
      id: this._id,
      gameRoundId: this._gameRoundId,
      points: this._points,
    }
  }
}

export default PlayerToGameRound;

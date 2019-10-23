'use strict'

class GameToGameRound {
  //TODO: Should id be [gameId+gameRoundId] or standard id like all the other?
  constructor(id, gameId, gameRoundId) {
    this._id = id;
    this._gameId = gameId;
    this._gameRoundId = gameRoundId;
  }

  get asJson() {
    return {
      id: this._id,
      gameId: this._gameId,
      gameRoundId: this._gameRoundId,
    }
  }

}

export default GameToGameRound;

"use strict";

import Dexie from "dexie/dist/dexie.js";

// Datenbankdefinition:
//
//   * ++id = Automatisch Hochgezählter Datenbankschlüssel
//   * artist, title = Indexfelder für WHERE-Abfragen und die Sortierung
//   * Alle anderen Felder müssen nicht deklariert werden!
//   * Vgl. http://dexie.org/docs/API-Reference
let database = new Dexie("Spieleverwaltung");

database.version(1).stores({
  songtexts: "++id, artist, title",
  game: '++id, gameName',
  player: '++id, playerName',
  gameRound: '++id, round, fin',
  gameToGameRound: '++id, [gameId+gameRoundId], gameId, gameRoundId',
  playerToGame: '++id, [playerId+gameId], playerId, gameId, win, lose',
  playerToGameRound: '++id, [playerId+gameRoundId], playerId, gameRoundId, points'

});

export default {
  database,
  Dexie,
};

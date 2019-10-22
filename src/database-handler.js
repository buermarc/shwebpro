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
  gameInstance: '++id',
  gameToGameInstance: '[gameId+gameInstanceId], gameId, gameInstanceId',
});

/**
 * Datenbankzugriffsklasse für Songtexte. Diese Klasse bietet verschiedene
 * Methoden, um Songtexte zu speichern und wieder auszulesen. Im Hintergrund
 * wird hierfür Dexie zur lokalen Speicherung im Browser genutzt.
 */

class Game {


  /**
   * Einen neues Game speichern oder einen vorhandenes Game
   * aktualisieren. Das Game-Objekt sollte hierfür folgenden Aufbau
   * besitzen:
   *
   * {
   *     gameName: "Name des Game",
   * //    title: "Name des Songs",
   *     format: "html",
   *     data: "HTML-String",
   * }
   *
   * @param  {Object}  game Zu speichernder Songtext
   * @return {Promise} Asynchrones Promise-Objekt
   */
  async saveNew(game) {
    return database.game.add(game);
  }

  /**
   * Bereits vorhandenen Songtext aktualisieren.
   * @param  {Object}  game Zu speichernder Songtext
   * @return {Promise} Asynchrones Promise-Objekt
   */
  async update(game) {
    return database.game.put(game);
  }

  /**
   * Vorhandenen Songtext anhand seiner ID löschen.
   * @param  {String}  id ID des zu löschenden Songtexts
   * @return {Promise} Asynchrones Promise-Objekt
   */
  async delete(id) {
    return database.game.delete(id);
  }

  /**
   * Löscht alle Songtexte!
   * @return {Promise} Asynchrones Promise-Objekt
   */
  async clear() {
    return database.game.clear();
  }

  /**
   * Vorhandenen Songtext anhand seiner ID auslesen.
   * @param  {String}  id ID des zu lesenden Songtexts
   * @return {Promise} Asynchrones Promise-Objekt mit dem Songtext
   */
  async getById(id) {
    return database.game.get(id);
  }

  /**
   * Gibt eine Liste mit allen Songtexten zurück, deren Titel oder Künstler
   * den gesuchten Wert enthalten.
   *
   * @param  {String}  query Gesuchter Titel oder Künstler
   * @return {Promise} Asynchrones Promise-Objekt mit dem Suchergebnis
   */
  async search(query) {
    if (!query) query = "";
    query = query.toUpperCase();

    let result = database.game.filter(songtext => {
      let artist = game.gameName.toUpperCase();
      //    let title = songtext.title.toUpperCase(); //Need more structure
      return artist.search(query) > -1 || title.search(query) > -1;
    });

    return result.toArray();
  }
}

class GameInstance {
  async saveNew(gameInstance) {
    return database.game.add(gameInstance);
  }
  async update(gameInstance) {
    return database.gameInstace.put(gameInstance)
  }
  async delete(gameInstace) {
    return database.gameInstance.delete(gameInstance)
  }
  async clear(gameInstace) {
    return database.gameInstance.clear()
  }
  async getById(id) {
    return database.gameInstance.get(id)
  }
  async search(query) {
    //TODO
  }
}

class Player {
  async saveNew(player) {
    return database.player.add(player)
  }
  async update(player) {
    return database.player.put(player)
  }
  async delete(player) {
    return database.player.delete(player)
  }
  async clear(player) {
    return database.player.clear()
  }
  async getById(id) {
    return database.player.get(id)
  }
  async search(query) {
    //TODO
  }
}

class GameToGameInstance {
  async addGameInstanceOfGame(gameId, gameInstanceId){}
}

export default {
  database,
  Game,
  GameInstance,
  Player,
};

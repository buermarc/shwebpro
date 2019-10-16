"use strict";

import Dexie from "dexie/dist/dexie.js";

// Datenbankdefinition:
//
//   * ++id = Automatisch Hochgezählter Datenbankschlüssel
//   * artist, title = Indexfelder für WHERE-Abfragen und die Sortierung
//   * Alle anderen Felder müssen nicht deklariert werden!
//   * Vgl. http://dexie.org/docs/API-Reference
let database = new Dexie("My-Songbook");

database.version(1).stores({
  songtexts: "++id, artist, title",
});

/**
 * Datenbankzugriffsklasse für Songtexte. Diese Klasse bietet verschiedene
 * Methoden, um Songtexte zu speichern und wieder auszulesen. Im Hintergrund
 * wird hierfür Dexie zur lokalen Speicherung im Browser genutzt.
 */
class Songtexts {


  /**
   * Einen neuen Songtext speichern oder einen vorhandenen Songtext
   * aktualisieren. Das Songtext-Objekt sollte hierfür folgenden Aufbau
   * besitzen:
   *
   * {
   *     artist: "Name des Künstlers",
   *     title: "Name des Songs",
   *     format: "html",
   *     data: "HTML-String",
   * }
   *
   * @param  {Object}  songtext Zu speichernder Songtext
   * @return {Promise} Asynchrones Promise-Objekt
   */
  async saveNew(songtext) {
    return database.songtexts.add(songtext);
  }

  /**
   * Bereits vorhandenen Songtext aktualisieren.
   * @param  {Object}  songtext Zu speichernder Songtext
   * @return {Promise} Asynchrones Promise-Objekt
   */
  async update(songtext) {
    return database.songtexts.put(songtext);
  }

  /**
   * Vorhandenen Songtext anhand seiner ID löschen.
   * @param  {String}  id ID des zu löschenden Songtexts
   * @return {Promise} Asynchrones Promise-Objekt
   */
  async delete(id) {
    return database.songtexts.delete(id);
  }

  /**
   * Löscht alle Songtexte!
   * @return {Promise} Asynchrones Promise-Objekt
   */
  async clear() {
    return database.songtexts.clear();
  }

  /**
   * Vorhandenen Songtext anhand seiner ID auslesen.
   * @param  {String}  id ID des zu lesenden Songtexts
   * @return {Promise} Asynchrones Promise-Objekt mit dem Songtext
   */
  async getById(id) {
    return database.songtexts.get(id);
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

    let result = database.songtexts.filter(songtext => {
      let artist = songtext.artist.toUpperCase();
      let title = songtext.title.toUpperCase();
      return artist.search(query) > -1 || title.search(query) > -1;
    });

    return result.toArray();
  }
}
export default {
  database,
  Songtexts,
};

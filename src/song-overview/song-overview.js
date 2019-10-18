"use strict";

import stylesheet from "./song-overview.css";
import Database from "../database.js";
/**
 * View mit der Übersicht der vorhandenen Songs.
 */
class SongOverview {
  /**
   * Konstruktor.
   * @param {Objekt} app Zentrales App-Objekt der Anwendung
   */
  constructor(app) {
    this._app = app;
    let test = async () => {
      let songtexts = new Database.Songtexts();
      await songtexts.clear();

      let songs = await songtexts.search();
      console.log("Alle Songs:", songs);

      if (songs.length === 0) {
        console.log("Bisher noch keine Songs vorhanden, lege deshalb Testdaten an");

        await Promise.all([
          songtexts.saveNew({
            artist: "Queen",
            title: "I Want To Break Free",
            format: "html",
            data: "HTML-Code für <b>I Want To Break Free</b> von <b>Queen</b>",
          }),
          songtexts.saveNew({
            artist: "Queen",
            title: "Radio Ga Ga",
            format: "html",
            data: "HTML-Code für <b>Radio Ga Ga</b> von <b>Queen</b>",
          }),
          songtexts.saveNew({
            artist: "Michael Jackson",
            title: "Billie Jean",
            format: "html",
            data: "HTML-Code für <b>Billie Jean</b> von 6lt;b>Michael Jackson</b>",
          }),
        ]);

        let songs = await songtexts.search();
        console.log("Gespeicherte Songs:", songs);
      }

      songs = await songtexts.search("queen");
      console.log('Suche nach dem Begriff "queen":', songs);
    }

    test();
  }

  /**
   * Von der Klasse App aufgerufene Methode, um die Seite anzuzeigen. Die
   * Methode gibt daher ein passendes Objekt zurück, das an die Methode
   * _switchVisibleContent() der Klasse App übergeben werden kann, um ihr
   * die darzustellenden DOM-Elemente mitzuteilen.
   *
   * @return {Object} Darzustellende DOM-Elemente gemäß Beschreibung der
   * Methode App._switchVisibleContent()
   */
  onShow() {
    let section = document.querySelector("#song-overview").cloneNode(true);

    return {
      className: "song-overview",
      topbar: section.querySelectorAll("header > *"),
      main: section.querySelectorAll("main > *"),
    };
  }

  /**
   * Von der Klasse App aufgerufene Methode, um festzustellen, ob der Wechsel
   * auf eine neue Seite erlaubt ist. Wird hier true zurückgegeben, wird der
   * Seitenwechsel ausgeführt.
   *
   * @param  {Function} goon Callback, um den Seitenwechsel zu einem späteren
   * Zeitpunkt fortzuführen, falls wir hier false zurückgeben
   * @return {Boolean} true, wenn der Seitenwechsel erlaubt ist, sonst false
   */
  onLeave(goon) {
    return true;
  }

  /**
   * @return {String} Titel für die Titelzeile des Browsers
   */
  get title() {
    return "Übersicht";
  }
}

export default SongOverview;

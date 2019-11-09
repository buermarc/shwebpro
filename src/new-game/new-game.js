"use strict";

import stylesheet from "./new-game.css";
import overview from './new-game.html';


/**
 * View zum Anzeigen des derzeitigen SPielstandes und eingabe der nächsten Ergebnisse.
 */
class NewGame {
  /**
   * Konstruktor.
   *
   * @param {Objekt} app  Zentrales App-Objekt der Anwendung
   * @param {String} id   ID des darzustellenden Spieles
   * @param {String} mode "new", "display" oder "edit"
   *
   */



   constructor(app) {
     this._app = app;

     this._spieler = ["Josia", "Karin", "Marc", "Lasse"];
     this._spielstand = [30, -90, 150, 120];
     this._gespielteRunden = 5;
     this._spiel="Doppelkopf";
     this._bodyTable="";


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
    async onShow() {

      let container = document.createElement("div");
      container.innerHTML = overview.trim();

      let section = container.querySelector("#new-game").cloneNode(true);
      this._listElement = section.querySelector("#new-game > main > div");
      this._documentElement = section.querySelector("#new-game > main");

      this.createTable(this._gespielteRunden);

      return {
        className: "new-game",
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
    async onLeave(goon) {
      return true;
    }

    /**
     * @return {String} Titel für die Titelzeile des Browsers
     */
    get title() {
      return "Neues Spiel";
    }

    createTable(runde){
      buildBodyTable(this._gespielteRunden, this._spiel);
      document.getElementById("tabelleOffeneSpiele").innerHTML +=
      // this._listElement.innerHTML +=
      '<table>'+
        this._bodyTable+
      '</table>';
    }

    buildBodyTable(runde, spiel){
      this._bodyTable += '<th>'+spiel+'</th>';
      for (var i = 0; i < this._spieler.length; i++) {
        createBodyTable(this._spieler[i], this._spielstand[i]);
      }
      this._bodyTable +=
        '<tr>'+
        '<td>Gespielte Runden: '+runde+'</td>'+
        '</tr>';
    }

    createBodyTable(spielername, punkte){
      this._bodyTable +=
      '<tr>'+
      '<td>'+spielername+'</td>'+
      '<td>'+punkte+'</td>'+
      '</tr>';
    }
}

export default NewGame;

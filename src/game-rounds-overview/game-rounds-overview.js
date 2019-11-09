"use strict";

import stylesheet from "./game-rounds-overview.css";
import overview from './game-rounds-overview.html';
import DataObjectHandler from '../data-access/data-object-handler.js';
import PlayerToGameRound from '../data-access/data-objects/player-to-game-round.js';
import Game from '../data-access/data-objects/game.js';
import GameRound from '../data-access/data-objects/game-round.js';
import GameToGameRound from '../data-access/data-objects/game-to-game-round.js';
import Player from '../data-access/data-objects/player.js';
import db from '../data-access/database-handler.js'

let database = db.database;


/**
 * View zum Anzeigen der offenen Runden eines Spieles
 */
class GameRoundsOverview {
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

     //Mockdaten => Daten aus Dantebank hohlen und in entsprechende Variablen Speichern
     this._spiele = [[], [], []];

     //Eventuelle for-Schleifen um Daten zu speichern oder für jedes Spielobjekt
     //einzeln durchlaufen
     this._spieler = ["Josia", "Karin", "Marc", "Lasse"];
     this._spielstand = [30, -90, 150, 120];
     this._gespielteRunden = 5;
     this._spiel="Doppelkopf";
     this._beendet = true;

     this._bodyTable="";

     //Buttons weiterspielen und rundeBeenden deaktivieren, sollte keine offene
     //Runde vorhanden sein
     if (this._beendet == true) {
       document.getElementById('weiterspielen').disabled = true;
     }

     if (this._spiele[0][0] == null) {
       document.getElementById('rundeBeenden').disabled = true;
     }

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

      let section = container.querySelector("#game-rounds-overview").cloneNode(true);
      this._listElement = section.querySelector("#game-rounds-overview > main > div");
      this._documentElement = section.querySelector("#game-rounds-overview > main");

      this.createTable(this._gespielteRunden);

      return {
        className: "game-rounds-overview",
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

      //Listener für die fünf Buttons initialisieren
      document.getElementById("neuesSpiel").addEventListener("click", () => {
        dialog.show();
      });

      document.getElementById("neuesSpielStarten").addEventListener("click", () => {
        //Datenobjekt an Lasses Screen geben
      });

      document.getElementById("abbrechen").addEventListener("click", () => {
        dialog.close();
      });

      document.getElementById("weiterspielen").addEventListener("click", () => {
        //Datenobjekt an Lasses Screen geben
      });

      document.getElementById("rundeBeenden").addEventListener("click", () => {
        //Variable Runde beendet auf true setzen
      });

      // HTML-Seite generieren
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

export default GameRoundsOverview;

"use strict";

import stylesheet from "./game-rounds-overview.css";
import overview from './game-rounds-overview.html';
import DataObjectHandler from '../data-access/data-object-handler.js';

class GameRoundsOverview {
  /**
   * Konstruktor.
   *
   * @param {Objekt} app  Zentrales App-Objekt der Anwendung
   * @param {String} id   ID des darzustellenden Spieles
   * @param {String} mode "new", "display" oder "edit"
   *
   */



  constructor(app, spielId) {
    this._app = app;
    this._spielId = 1; //spielId
    this._bodyTable = "";

    this._doh = new DataObjectHandler(true);
    //Mockdaten => Daten aus Dantebank hohlen und in entsprechende Variablen Speichern
    // this._spiele = [
    //   [],
    //   [],
    //   []
    // ];

    //Eventuelle for-Schleifen um Daten zu speichern oder für jedes Spielobjekt
    //einzeln durchlaufen
    // this._spieler = ["Josia", "Karin", "Marc", "Lasse"];
    // this._spielstand = [30, -90, 150, 120];
    // this._gespielteRunden = 5;
    // this._spiel = "Doppelkopf";
  }

  async onShow() {

    let container = document.createElement("div");
    container.innerHTML = overview.trim();

    let section = container.querySelector("#game-rounds-overview").cloneNode(true);
    this._listElement = section.querySelector("#game-rounds-overview > main > div");
    this._documentElement = section.querySelector("#game-rounds-overview > main");

    var modal1 = section.querySelector("#myModal1");
    var modal2 = section.querySelector("#myModal2");

    section.querySelector("#neuesSpiel").addEventListener("click", neuesSpiel);
    // section.querySelector("#weiterSpielen").addEventListener("click", weiterSpielen);
    // section.querySelector("#rundeBeenden").addEventListener("click", rundeBeenden);
    section.querySelector("#abbrechen").addEventListener("click", abbrechen);
    section.querySelector("#weiter").addEventListener("click", weiter);
    section.querySelector("#zurück").addEventListener("click", zurück);
    section.querySelector("#neuesSpielErstellen").addEventListener("click", neuesSpielErstellen);

    section.querySelector("#closeModal1").addEventListener("click", xButton);
    section.querySelector("#closeModal2").addEventListener("click", xButton);

    function neuesSpiel(){
      modal1.style.display = "block";
    }

    // function weiterSpielen(){
    //   //Datenobjekt an Lasses Screen geben
    // }
    //
    // function rundeBeenden(){
    //   //Variable Runde beendet auf true setzen
    // }
    //
    function abbrechen(){
      modal1.style.display = "none";
    }

    function weiter(){
      modal1.style.display = "none";
      var anzahl = document.querySelector("#spieleranzahl").value;
        var string = "";
        for (var i = 0; i < anzahl; i++) {
          string += '<input id="'+i+'" class="inputField">' +
            '</input>' +
            '<br>';
        }
      document.querySelector("#anzahlSpieler").innerHTML = string;
      modal2.style.display = "block";
    }

    function zurück(){
      modal2.style.display = "none";
      modal1.style.display = "block";
    }

    function neuesSpielErstellen(){
      modal2.style.display = "none";
      var anzahl = document.querySelector("#spieleranzahl").value;
      for (var i = 0; i < anzahl; i++) {
        var spieler = this._documentElement.getElementById(i);
        this._doh.setNewPlayer(spieler);
      }
      //Datenobjekt an Lasses Screen geben
    }

    function xButton(){
      modal1.style.display = "none";
      modal2.style.display = "none";
    }

    window.onclick = function(event) {
      if (event.target == modal1 || event.target == modal2) {
        modal1.style.display = "none";
        modal2.style.display = "none";
      }}

    this.createTable(this._doh, this._spielId);

    return {
      className: "game-rounds-overview",
      topbar: section.querySelectorAll("header > *"),
      main: section.querySelectorAll("main > *"),
    };
  }

  async onLeave(goon) {
    return true;
  }

  get title() {
    return "Neues Spiel";
  }

  async createTable(doh, spielId) {

    //von Marc: den gesamten HTML-Code per JS einfügen

    // this._documentElement.innerHTML =
    //   `<div class="offeneSpiele" id="tabelleOffeneSpiele"></div>
    //   <button id="neuesSpiel">Neues Spiel</button>
    //   <button id="weiterspielen">Weiterspielen</button>
    //   <button id="rundeBeenden">Runde Beenden</button>
    //   <dialog>
    //       <p>Anzahl der Spieler festlegen</p>
    //       <input placeholder="Anzahl der Spieler eingeben" type="number" id="spieleranzahl"></input>
    //       <br>
    //       <button id="abbrechen">Abbrechen</button>
    //       <button id="weiter">Weiter</button>
    //   </dialog>
    //   <dialog>
    //       <h2>Spieler</h2>
    //       <div id="anzahlSpieler"></div>
    //       <button id="zurück">Abbrechen</button>
    //       <button id="neuesSpielErstellen">Neues Spiel erstellen</button>
    //   </dialog>`

    let offeneSpiele = await doh.getOpenRoundsByGameId(spielId);
    let spiel = await doh.getGameById(spielId);

    for (var i = 0; i < offeneSpiele.length; i++) {
      // Für jede Runde erneut abfragen
      let spieler = await doh.getAllPlayerOfGameRoundId(offeneSpiele[i].id); //Json Object
      // playerId: this._playerId,
      // gameRoundId: this._gameRoundId,
      // points: this._points,
      let spielerNamen = await Promise.all(spieler.map(async spiel => {
        let playerName = await doh.getPlayerById(spiel.playerId);
        playerName = playerName.playerName;
        return playerName;
      }));
      let runde = await doh.getGameRoundById(offeneSpiele[i].id);
      // HTML-Seite generieren //Hier stimmt was nicht, in
      this.buildBodyTable(runde.rounds, spiel.gameName, spieler, spielerNamen);
    }

    console.log(this._listElement.parentNode.querySelector("#tabelleOffeneSpiele"));
    this._listElement.parentNode.querySelector("#tabelleOffeneSpiele").innerHTML +=
      // this._listElement.innerHTML +=
      '<table>' +
      this._bodyTable +
      '</table>';
  }

  buildBodyTable(runde, spielName, spieler, spielerNamen) {
    this._bodyTable += '<th>' + spielName + '</th>';
    for (var i = 0; i < spielerNamen.length; i++) {
      this.createBodyTable(spielerNamen[i], spieler[i].points);
    }
    this._bodyTable +=
      '<tr>' +
      '<td>Gespielte Runden: ' + runde + '</td>' +
      '</tr>';
  }

  createBodyTable(spielername, punkte) {
    this._bodyTable +=
      '<tr>' +
      '<td>' + spielername + '</td>' +
      '<td>' + punkte + '</td>' +
      '</tr>';
  }
}

export default GameRoundsOverview;

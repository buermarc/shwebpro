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
    this._spielId = parseInt(spielId); //spielId
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

    this._gameRoundIds = [];

    this._minPlayers = await this._doh.getGameById(this._spielId);
    var minPlayers = this._minPlayers.minPlayers;
    this._maxPlayers = await this._doh.getGameById(this._spielId);
    var maxPlayers = this._maxPlayers.maxPlayers;

    if (minPlayers == null) {
      minPlayers = 1;
    } else if (maxPlayers == null) {
      maxPlayers = 100;
    };

    let container = document.createElement("div");
    container.innerHTML = overview.trim();

    let section = container.querySelector("#game-rounds-overview").cloneNode(true);
    this._listElement = section.querySelector("#game-rounds-overview > main > div");
    this._documentElement = section.querySelector("#game-rounds-overview > main");

    var modal1 = section.querySelector("#myModal1");
    var modal2 = section.querySelector("#myModal2");



    section.querySelector("#neuesSpiel").addEventListener("click", neuesSpiel);
    section.querySelector("#abbrechen").addEventListener("click", abbrechen);
    section.querySelector("#weiter").addEventListener("click", weiter);
    section.querySelector("#zurück").addEventListener("click", zurück);
    section.querySelector("#neuesSpielErstellen").addEventListener("click", () => {
      neuesSpielErstellen(this._doh, this._spielId)
    });

    section.querySelector("#closeModal1").addEventListener("click", xButton);
    section.querySelector("#closeModal2").addEventListener("click", xButton);

    function neuesSpiel() {
      modal1.style.display = "block";
    }

    function abbrechen() {
      modal1.style.display = "none";
      document.querySelector("#spieleranzahl").value = "";
    }

    function weiter() {
      if (document.querySelector("#spieleranzahl").value <= maxPlayers && document.querySelector("#spieleranzahl").value >= minPlayers) {
        //if (document.querySelector("#spieleranzahl").value < 10 && document.querySelector("#spieleranzahl").value >= 1) {
        modal1.style.display = "none";
        var anzahl = document.querySelector("#spieleranzahl").value
        var string = "";
        var spielerNummer = 1;
        for (var i = 0; i < anzahl; i++) {
          string +=
            '<label class="spielerLabel">Spieler ' + spielerNummer + ':</label>' +
            '<input id="spieler' + i + '" class="inputField" maxlength="10" size="10"></input>' +
            '<br>';
          spielerNummer += 1;
        }
        document.querySelector("#anzahlSpieler").innerHTML = string;
        modal2.style.display = "block";
      } else {
        document.querySelector("#spieleranzahl").value = "";
        alert("Bitte gib eine Zahl ein, die größer oder gleich " + minPlayers + " ist, beziehungsweise kleiner oder gleich " + maxPlayers + " ist!");
      }

    }

    function zurück() {
      modal2.style.display = "none";
      modal1.style.display = "block";
      document.querySelector("#spieleranzahl").value = "";
    }

    async function neuesSpielErstellen(doh, spielId) {
      var anzahl = document.querySelector("#spieleranzahl").value;
      document.querySelector("#spieleranzahl").value = "";
      var spielerId = [];
      for (var i = 0; i < anzahl; i++) {
        var spieler = document.querySelector("#spieler" + i).value;
        console.log(spieler);
        spielerId[i] = await doh.setNewPlayer(spieler);
        console.log(spielerId[i]);
      }
      console.log("asd");
      console.log(spielerId);
      console.log(spielId);
      modal2.style.display = "none";
      let gameRoundId = await doh.setNewGameRoundWithPlayers(spielId, spielerId);
      console.log(gameRoundId);
      window.location.href = "#/roundOverview/" + gameRoundId;
    }

    function xButton() {
      modal1.style.display = "none";
      modal2.style.display = "none";
      document.querySelector("#spieleranzahl").value = "";
    }

    window.onclick = function(event) {
      if (event.target == modal1 || event.target == modal2) {
        modal1.style.display = "none";
        modal2.style.display = "none";
        document.querySelector("#spieleranzahl").value = "";
      }
    }

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
    var weiterSpielen = 0;
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

      weiterSpielen += 1;
      this.buildBodyTable(offeneSpiele[i].round, spiel.gameName, spieler, spielerNamen, weiterSpielen, offeneSpiele[i].id);
    }
    if (offeneSpiele.length == 0) {
      this._bodyTable += '<th class="tableHeader" colspan="2">' + spiel.gameName + '</th>' +
        '<tr>' + '<td colspan="2" class="spielerPunkte">Keine offenen Spiele</td>' + '</tr>';
    }

    console.log(this._listElement.parentNode.querySelector("#tabelleOffeneSpiele"));
    this._listElement.parentNode.querySelector("#tabelleOffeneSpiele").innerHTML +=
      // this._listElement.innerHTML +=
      '<table  class="tableElements">' +
      this._bodyTable +
      '</table>';
      let tmpButtons = this._listElement.parentNode.querySelectorAll('.weiterSpielen');
      console.log(tmpButtons);
      if (tmpButtons.length == this._gameRoundIds.length) {
        let u = 0
        tmpButtons.forEach(x => {
          x.addEventListener('click', () => {
            window.location.href = '#/roundOverview/'+ this._gameRoundIds[u++];
          });
        });
      } else {
        throw 'buttons and array of gamerounds not the same length';
      }
  }

  buildBodyTable(runde, spielName, spieler, spielerNamen, weiterSpielen, gameRoundId) {
    this._bodyTable += '<th class="tableHeader" colspan="2">' + spielName + '</th>' +
      '<tr>' + '<td class="spielerPunkte">Spieler</td>' + '<td class="spielerPunkte">Punkte</td>' + '</tr>';
    for (var k = 0; k < spielerNamen.length; k++) {
      this.createBodyTable(spielerNamen[k], spieler[k].points);
    }

    this._gameRoundIds.push(gameRoundId);
    this._bodyTable +=
      '<tr>' +
      '<td class="gespielteRunde" colspan="2">Gespielte Runden: ' + runde + '<button class="weiterSpielen" id="weiterSpielen" href="#/roundOverview/' + gameRoundId + '" data-navigo>Weiterspielen</button></td>' +
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

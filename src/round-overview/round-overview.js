"use strict";

import stylesheet from "./round-overview.css";
import overview from './round-overview.html';
import DataObjectHandler from "../data-access/data-object-handler.js"


/**
 * View zum Anzeigen des derzeitigen SPielstandes und eingabe der nächsten Ergebnisse.
 */
class RoundOverview {
  /**
   * Konstruktor.
   *
   * @param {Objekt} app  Zentrales App-Objekt der Anwendung
   * @param {String} id   ID des darzustellenden Spieles
   * @param {String} mode "new", "display" oder "edit"
   *
   */



  constructor(app, gameRoundId) {
    this._app = app;

    this._doh = new DataObjectHandler(true);
    this._gameRoundId = parseInt(gameRoundId);
    this._game = null;


  }

  /**
   * Von der Klasse App aufgerufene Methode, um die Seite anzuzeigen. Die
   * Methode gibt daher ein passendes Objekt zurück, das an die Methode
   * _switchVisibleContent() der Klasse App übergebenwerden kann, um ihr
   * die darzustellenden DOM-Elemente mitzuteilen.
   *
   * @return {Object} Darzustellende DOM-Elemente gemäß Beschreibung der
   * Methode App._switchVisibleContent()
   */
  async onShow() {

    let container = document.createElement("div");
    container.innerHTML = overview.trim();

    let section = container.querySelector("#round-overview").cloneNode(true);
    this._listElement = section.querySelector(".tSpieler");
    this._listButton = section.querySelector(".d");

    let rundenAnzeige = section.querySelector("#anzeigeRunde");
    let spielAnzeige = section.querySelector("#rundeText");

    var modal = section.querySelector("#myModal");

    section.querySelector("#statistikB").addEventListener("click", openStatistik);

    function openStatistik() {
      window.location.href = "#/stats";
    }
    section.querySelector("#zurueckUebersicht").addEventListener("click", openUebersicht);

    function openUebersicht() {
      window.location.href = "#/gameOverview";
    }


    this.createContent(this._doh, this._gameRoundId, rundenAnzeige, spielAnzeige, modal);

    return {
      className: "round-overview",
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
    return "Rundenübersicht";
  }

  async createContent(doh, gameRoundId, rundenAnzeige, spielAnzeige, modal) {
    let anzeigeRunde = rundenAnzeige;
    let anzeigeSpiel = spielAnzeige;
    let gameRound = await doh.getGameRoundById(gameRoundId);
    let spielstand = await doh.getAllPlayerOfGameRoundId(gameRoundId);
    let game = await doh.getGameByGameRoundId(gameRoundId);
    this._game = game;

    var btn = document.createElement("BUTTON");
    btn.classList.add("border-fade");
    btn.id = "buttonSpeichern";
    btn.innerHTML = "Speichern";
    this._listButton.appendChild(btn);
    var btnB = document.createElement("BUTTON");
    btnB.classList.add("border-fade");
    btnB.id = "buttonBeenden";
    btnB.innerHTML = "Beenden";
    this._listButton.appendChild(btnB);

    this.setzeAnzeige(doh, anzeigeRunde, anzeigeSpiel, gameRoundId);

    for (var i = 0; i < spielstand.length; i++) {
      let spielerName = await doh.getPlayerById(spielstand[i].playerId);
      this.buildTable(spielerName.playerName, spielstand[i].points, i)
    }

    btn.addEventListener("click", () => {
      this.speichern(doh, gameRound.id, rundenAnzeige, spielAnzeige, modal)
    });
    btnB.addEventListener("click", () => {
      this.spielBeenden(doh, gameRound.id, modal)
    });

  }

  async setzeAnzeige(doh, anzeigeRunde, anzeigeSpiel, gameRoundId) {

    let gameRound = await doh.getGameRoundById(gameRoundId);
    let game = await doh.getGameByGameRoundId(gameRoundId);


    let aktuelleRunde = gameRound.round;
    let insgesamtRunden = game.maxRounds;
    let spielName = game.gameName;


    if (insgesamtRunden >= 0) {
      anzeigeSpiel.innerHTML = spielName;
      anzeigeRunde.innerHTML = 'Runde: ' + aktuelleRunde + ' / ' + insgesamtRunden;
    } else {
      anzeigeSpiel.innerHTML = spielName;
      anzeigeRunde.innerHTML = 'Runde: ' + aktuelleRunde
    }
  }

  buildTable(name, punkte, nummer) {
    this._listElement.innerHTML += `
    <div class="tSpielerColumnName" >
        <h2>` + name + `</h2>
      </div>
      <div class="tSpielerColumnPunkte">
        <h2 id="spPunkte` + nummer + `">` + punkte + `</h2>
      </div>
      <div class="tSpielerColumnInput">
        <input class="inputFocus" type="number" id="spInput` + nummer + `"/>
      </div>
    `;
  }

  async speichern(doh, gameRoundId, rundenAnzeige, spielAnzeige, modal) {
    let gameRound = await doh.getGameRoundById(gameRoundId);
    let aktuelleRunde = gameRound.round;
    let spielstand = await doh.getAllPlayerOfGameRoundId(gameRoundId);
    let game = await doh.getGameByGameRoundId(gameRoundId);

    for (var i = 0; i < spielstand.length; i++) {
      var wert = document.getElementById("spInput" + i).value;
      if (wert == "") {
        window.alert("Bitte alle Felder ausfüllen");
        return;
      }
    }
    for (var i = 0; i < spielstand.length; i++) {
      var wert = document.getElementById("spInput" + i).value;
      var wert = parseInt(wert, 10);
      var wert2 = parseInt(spielstand[i].points, 10);
      wert += wert2;
      await doh.updatePointsByPlayerIdAndGameRoundId(spielstand[i].playerId, spielstand[i].gameRoundId, wert)
      document.getElementById("spPunkte" + i).innerHTML = wert;
      document.getElementById("spInput" + i).value = "";
    }
    if (aktuelleRunde >= game.maxRounds - 1) {
      await doh.setGameRoundFinsihedById(gameRoundId);
      let beste = 0;
      for (var i = 0; i < spielstand.length; i++) {
        if (spielstand[i].points > spielstand[beste].points) {
          beste = i;
        }
      }
      let gewinner = await doh.getPlayerById(spielstand[beste].playerId);
      await doh.setWinOrLoseForPlayerAndGame(game.id, gewinner.id, true);
      for (let k = 0; k < spielstand.length; k++) {
        if (spielstand[k].playerId != gewinner.id) {
          await doh.setWinOrLoseForPlayerAndGame(game.id, spielstand[k].playerId, false);
        }
      }
      document.getElementById("gewinnerAnzeige").innerHTML = gewinner.playerName + ' hat gewonnen!'
      modal.style.display = "block";

    }
    doh.updateRoundByGameRoundId(gameRoundId, aktuelleRunde + 1);
    this.setzeAnzeige(doh, rundenAnzeige, spielAnzeige, game.id);
  }

  async spielBeenden(doh, gameRoundId, modal) {
    let spielstand = await doh.getAllPlayerOfGameRoundId(gameRoundId);
    await doh.setGameRoundFinsihedById(gameRoundId);
    let beste = 0;
    for (var i = 0; i < spielstand.length; i++) {
      if (spielstand[i].points > spielstand[beste].points) {
        beste = i;
      }
    }
    let gewinner = await doh.getPlayerById(spielstand[beste].playerId);
      await doh.setWinOrLoseForPlayerAndGame(this._game.id, gewinner.id, true);
      for (let k = 0; k < spielstand.length; k++) {
        if (spielstand[k].playerId != gewinner.id) {
          await doh.setWinOrLoseForPlayerAndGame(this._game.id, spielstand[k].playerId, false);
        }
      }
    document.getElementById("gewinnerAnzeige").innerHTML = gewinner.playerName + ' hat gewonnen!'
    modal.style.display = "block";

  }

}

export default RoundOverview;

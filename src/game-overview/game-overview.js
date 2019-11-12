"use strict";

import stylesheet from "./game-overview.css";
import overview from './game-overview.html';

/**
 *  {
 *  id: 4,
 *  name: "Tichu"
 * }
 */

var elements = document.getElementsByClassName("column");
var i;

/**
 * View zur Anzeige oder zum Bearbeiten eines Songs.
 */
class GameOverview {
  /**
   * Konstruktor.
   *
   * @param {Objekt} app  Zentrales App-Objekt der Anwendung
   * @param {String} id   ID des darzustellenden Songs
   * @param {String} mode "new", "display" oder "edit"
   */
  constructor(app) {
    this._app = app;

    this._spiel = ["Doppelkopf", "Spiel","Doppelkopf"];
   
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
    
    let section = container.querySelector("#game-overview").cloneNode(true);
    this._listElement = section.querySelector("#game-overview > main > div");
    this._documentElement = section.querySelector("#game-overview > main");

    this.createList();

    return {
      className: "game-overview",
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
    return "Spieleübersicht";
  }

  createList(){

    var amount = this._spiel.length;
    var btn = document.createElement("button");
    btn.id = "button1"
    btn.innerHTML = "neues Spiel hinzufügen";
    this._documentElement.appendChild(btn);

    for (var i = 0; i < this._spiel.length; i++) {
      this.buildList(this._spiel[i], i);
    }

    btn.addEventListener("click", Warnung);

    function Warnung(){
      if (amount == 8){
        window.alert("Keine weiteren Spiele möglich");
      }
      else{window.alert("HI");
    }

    this._listElement.addEventListener("click", function(e) {
      // e.target is our targetted element.
                  // try doing console.log(e.target.nodeName), it will result LI
          window.alert(e.target.id + " was clicked");
      });

      if (this._spiel.length < 1) {
        // Hinweistext, wenn noch keine Songs vorhanden sind
        this._listElement.innerHTML += `
              <li>
                  <div class="padding no-data">
                      Noch keine Spiele vorhanden
                  </div>
              </li>
          `;
      };
    }}
    

  buildList(name){
    this._listElement.innerHTML+=`
    <div class="lSpiel" >
      <ul>
        <li>`+name+`</li>
      </ul>
    </div>
    `;
  }
}
export default GameOverview;

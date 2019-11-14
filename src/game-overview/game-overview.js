"use strict";

import stylesheet from "./game-overview.css";
import overview from './game-overview.html';
import DataObjectHandler from '../data-access/data-object-handler.js';


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
   *
   */


   
  constructor(app) {
    this._app = app;

    //"Doppelkopf", "Spiel","Doppelkopf"
    this._spiel = [];
    this._doh = new DataObjectHandler(true);
    
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
    //this._popUpElement = section.querySelector("#game-overview > main > dialog");
    this._documentElement = section.querySelector("#game-overview > main");

    section.querySelector('#modalButton').addEventListener("click", ()=> { console.log('wtf')
    document.getElementById('id01').className ="modalDivShow"
    document.getElementById("main").className = "inactive"});
    

    this.createList(this._doh);

    return {
      className: "game-overview",
      topbar: section.querySelectorAll("header > *"),
      main: section.querySelectorAll("main > *"),
    };
  }

  modalTest() {
   
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

  async createList(doh){
    
    //this._popUpElement.parentNode.querySelector("#abbrechenNeuesSpiel").addEventListener("click", () => {
    //  document.getElementsByTagName('dialog')[0].close();
    //});
    
    // copy and paste _documentElementAustauschen
    var amount = this._spiel.length;
    var btn = document.createElement("button");
    btn.id = "button0"
    btn.innerHTML = "neues Spiel hinzufügen";
    this._documentElement.appendChild(btn);

    //var btnClose = document.createElement("button");
    //btnClose.id = "buttonClose"
    //btnClose.innerHTML = "abbrechen";
    //this._popUpElement.appendChild(btnClose);

    console.log("Test1");
 
    //btn.addEventListener("click", Warnung);
    //btnClose.addEventListener("click", Hi);

    //document.querySelector("#weiterNeuesSpiel").addEventListener("click", Hi);

    function Warnung(){
      console.log("HHHH");
      if (amount == 8){
        window.alert("Keine weiteren Spiele möglich");
      }
      else{
        document.getElementsById('modalButton').addEventListener("click", modalTest)
      }
    }

    function Hi(){
      console.log("Hi");
        document.getElementsByTagName('dialog')[0].close();
    }

    this._spiel = await doh.getAllGames();
      for (var i = 0; i < this._spiel.length; i++) {
        this.buildList(this._listElement,this._spiel[i].gameName);
      }
      /*for (var i = 0; i < this._spiel.length; i++) {
        this.buildList(this._popUpElement,this._spiel[i].gameName);
      }*/


    
      if (this._spiel.length == 0) {
        // Hinweistext, wenn noch keine Spiele vorhanden sind
        this._listElement.innerHTML += `
              <li>
                  <div class="padding no-data">
                      Noch keine Spiele vorhanden
                  </div>
              </li>
          `;
      };

    this._listElement.addEventListener("click", function(e) {
      // e.target is our targetted element.
                  // try doing console.log(e.target.nodeName), it will result LI
          window.alert(e.target.id + " was clicked");
      });
    }
  
    

  buildList(element,name){
    element.innerHTML+=`
    <div class="lSpiel" >
      <ul>
        <li>`+name+`</li>
      </ul>
    </div>
    `;
  }

}
export default GameOverview;

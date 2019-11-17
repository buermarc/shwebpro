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
 * View zur Anzeige oder zum Bearbeiten eines Spiele.
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
    this._listElement = section.querySelector(".lSpiel");
    this._modalElement = section.querySelector(".modal-body");
    this._modalElementListe = section.querySelector(".modal-body > ul");
    this._documentElement = section.querySelector("#game-overview > main");

    //alles zum Modal
    section.querySelector("#modalButton").addEventListener("click", openModal);
    var modal = section.querySelector("#myModal");
    section.querySelector("#closeModal").addEventListener("click", closeModal);

    function openModal(){
      modal.style.display = "block";
    }

    function closeModal(){
      modal.style.display = "none";
    }

    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }}

    // Liste erstellen
    this.createList(this._doh);

    //Eventlistener modal element 
    this._spiel = await this._doh.getAllGames();
    for (var i = 0; i < this._spiel.length; i++) {
      let element = this._modalElementListe.querySelector("#element"+this._spiel[i].gameName);
      let name = this._spiel[i].gameName;
      if(element!=null){
        element.addEventListener("click", () => {
          this.addElementListSpiel(name,this._spiel[i].id);
        });
      }
    }

    //Eventlistener listSpiel
    for (var i = 0; i < this._spiel.length; i++) {
      let element = this._listElement.querySelector("#element"+this._spiel[i].gameName);
      let name = this._spiel[i].gameName;
      if(element!=null){
        element.addEventListener("click", () => {
          window.location.href="#gameRoundsOverview" + this._spiel[i].id;
        });
      }
    }

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

  async createList(doh){

    this._spiel = await doh.getAllGames();
     
    
      if (this._spiel.length == 0) {
        // Hinweistext, wenn noch keine Spiele vorhanden sind
        this._listElement.innerHTML += `
              <li>
                  <div class="padding no-data">
                      Noch keine Spiele vorhanden
                  </div>
              </li>
          `;
      }else{
        for (var i = 0; i < this._spiel.length; i++) {
          this.buildList(this._listElement, this._spiel[i].gameName);
        }
        for (var i = 0; i < this._spiel.length; i++) {
          let elementName = this._listElement.querySelector("#element"+this._spiel[i].gameName);
          if(elementName==null){
            this.buildList(this._modalElementListe,this._spiel[i].gameName);
          }
        }
      }
  }
  async addElementListSpiel(spielName, spielId){
    let elementName = this._listElement.querySelector("#element"+spielName);
    if(elementName==null){
      let elementModalListe = this._modalElementListe.querySelector("#element"+spielName);
      modalElement.removeChild(elementModalListe);
      this.buildList(this._listElement, spielName);
      window.location.href="#gameRoundsOverview" + spielId;
    }
  }

  buildList(element,name){
    
    element.innerHTML+=`
        <li  class="listElement" id="element`+name+`">`+name+`
        </li>
    `;
    
  }

}
export default GameOverview;

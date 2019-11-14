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

   

  constructor(app) {
    this._app = app;

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
    
    let section = container.querySelector("#round-overview").cloneNode(true);
    this._listElement = section.querySelector("#round-overview > main > div");

    this.createContent(this._doh, 1);
    //this.createPopUp();

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

  async createContent(doh, gameId){
    let gameRound = await doh.getGameRoundById(gameId);
    let spielstand = await doh.getAllPlayerOfGameRoundId(gameRound.id);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "Speichern";
    this._listElement.parentNode.appendChild(btn);
    
    for (var i = 0; i < spielstand.length; i++) {
      this.buildTable(spielstand[i].playerId, spielstand[i].points, i)
    }

   btn.addEventListener("click", () => {
    this.speichern(doh, gameRound.id)    
  });

  }

  buildTable(name, punkte, nummer){
    this._listElement.innerHTML+=`
    <div class="tSpielerColumnName" >
        <h2>`+name+`</h2>
      </div>
      <div class="tSpielerColumnPunkte">
        <h2 id="spPunkte`+nummer+`">`+punkte+`</h2>
      </div>
      <div class="tSpielerColumnInput">
        <input type="number" id="spInput`+nummer+`"/>
      </div>
    `;
  }
  
  /*createPopUp(){
    var btnPop = document.createElement("BUTTON");
    btnPop.innerHTML = "PopPopPop";
    this._listElement.parentNode.appendChild(btnPop);

    var pop = document.createElement("div");
    pop.classList.add("modal");
    pop.id = "myModal";
    this._listElement.parentNode.appendChild(pop);

    var modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    pop.appendChild(modalContent);
  
    var modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");
    modalContent.appendChild(modalHeader);

    var spanClose = document.createElement("span");
    spanClose.classList.add("close");
    spanClose.innerHTML = "&times;"
    modalHeader.appendChild(spanClose);


    var modalHeaderText = document.createElement("h2");
    modalHeaderText.innerHTML = "Modal Header"
    modalHeader.appendChild(modalHeaderText);
    
    var modalBody = document.createElement("div");
    modalBody.classList.add("modal-body");
    modalContent.appendChild(modalBody);

    var modalBodyP1 = document.createElement("p");
    modalBodyP1.innerHTML = "Blablabla";
    modalBody.appendChild(modalBodyP1);


    var modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-footer");
    modalContent.appendChild(modalFooter);

    spanClose.onclick = function() {
      pop.style.display = "none";
    }
    btnPop.onclick = function() {
      pop.style.display = "block";
    }
    window.onclick = function(event) {
      if (event.target == pop) {
        pop.style.display = "none";
      }
    }
  }*/

  async speichern(doh, gameRoundId){
    let spielstand = await doh.getAllPlayerOfGameRoundId(gameRoundId);
    for(var i = 0; i<spielstand.length; i++){
      var wert = document.getElementById("spInput"+i).value;
      if(wert==""){window.alert("Bitte alle Felder ausfüllen"); return;}
    }
    for(var i = 0; i<spielstand.length;i++){
      var wert = document.getElementById("spInput"+i).value;
      var wert = parseInt(wert, 10);
      var wert2 = parseInt(spielstand[i].points, 10);
      wert += wert2;
      await doh.updatePointsByPlayerIdAndGameRoundId(spielstand[i].playerId, spielstand[i].gameRoundId, wert)
      document.getElementById("spPunkte"+i).innerHTML=wert;
      document.getElementById("spInput"+i).value="";
    }
  }
  
  
}

export default RoundOverview;

"use strict";

import stylesheet from "./round-overview.css";
import overview from './round-overview.html';


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

    this._spieler = ["Josia", "Karin", "Marc", "Lasse"];
    this._spielstand = [30, -90, 150, 120];
  


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
    this._documentElement = section.querySelector("#round-overview > main");

    this.createTable();
  

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

  createTable(){
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "Speichern";
    this._documentElement.appendChild(btn);
    
    for (var i = 0; i < this._spieler.length; i++) {
      this.buildTable(this._spieler[i], this._spielstand[i], i)
    }

   btn.addEventListener("click", () => {
    this.speichern()    
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

  speichern(){
    for(var i = 0; i<this._spieler.length;i++){
      var wert = document.getElementById("spInput"+i).value;
      if(wert==0){window.alert("Bitte alle Felder ausfüllen"); return;}
    }
    for(var i = 0; i<this._spieler.length;i++){
      var wert = document.getElementById("spInput"+i).value;
      var wert = parseInt(wert, 10);
      var wert2 = parseInt(this._spielstand[i], 10);
      this._spielstand[i]=wert2+wert;
      document.getElementById("spPunkte"+i).innerHTML=this._spielstand[i];
      document.getElementById("spInput"+i).value="";
    }
  }
  
}

export default RoundOverview;

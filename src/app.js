'use strict'

import stylesheet from './app.css';
import SongDisplayEdit from "./song-display-edit/song-display-edit.js";
import SongOverview from "./song-overview/song-overview.js";
import Stats from './stats/stats.js';
import GameStats from './game-stats/game-stats.js';
import PlayerStats from './player-stats/player-stats.js';
import GameOverview from "./game-overview/game-overview.js";
import RoundOverview from "./round-overview/round-overview.js";
import GameRoundsOverview from "./game-rounds-overview/game-rounds-overview.js";
import Navigo from 'navigo/lib/navigo.js';
import DataObjectHandler from './data-access/data-object-handler.js';

class App {
  constructor() {
    this._title = "Spielstandzähler";
    this._currentView = null;

    // Single Page Router aufsetzen
    this._router = new Navigo(null, true);
    this._currentUrl = "";
    this._navAborted = false;

    this._router.on({
      "*": () => this.showGameOverview(),
      '/stats/': () => this.showStats(),
      '/stats/game/:gameName/': params => this.showStatsGame(params.gameName),
      '/stats/player/:playerName/': params => this.showStatsPlayer(params.playerName),
      "/gameOverview": () => this.showGameOverview(),
      "/roundOverview/:gameRoundId/": (params) => this.showRoundOverview(params.gameRoundId),
      "/gameRoundsOverview/:id": (params) => this.showGameRoundsOverview(params.id),
    });

    // this._router.hooks({
    //   after: (params) => {
    //     if (!this._navAborted) {
    //       // Navigation durchführen, daher die neue URL merken
    //       this._currentUrl = this._router.lastRouteResolved().url;
    //     } else {
    //       // Navigation abbrechen, daher die URL in der Adresszeile
    //       // auf den alten Wert der bisherigen View zurücksetzen
    //       this._router.pause(true);
    //       this._router.navigate(this._currentUrl);
    //       this._router.pause(false);
    //
    //       this._navAborted = false;
    //     }
    //   }
    // });

    this._router.hooks({
      after: (params) => {
        // Navigation durchführen, daher die neue URL merken
        this._currentUrl = this._router.lastRouteResolved().url;
      }
    });


    let menuButton = document.querySelector("header .hamburger-menu");

    menuButton.addEventListener("click", () => {
      // Nur auf kleinen Bildschirmen auf den Klick reagieren
      if (menuButton.classList.contains("inactive")) return;

      // Sichtbarkeit des Menüs umschalten
      let menuState = "menu-open";
      if (menuButton.classList.contains("menu-open")) menuState = "menu-closed";

      menuButton.classList.remove("menu-open");
      menuButton.classList.remove("menu-closed");
      menuButton.classList.add(menuState);

      // Menüeinträge ein-/ausblenden
      document.querySelectorAll("header .menu-content").forEach(element => {
        if (menuState === "menu-open") {
          element.classList.remove("hidden");
        } else {
          element.classList.add("hidden");
        }
      });
    });

    let _initHamburgerMenu = () => {
      // Menübutton auf großen Bildschirmen inaktiv schalten
      // Klasse .inactive für das Element mit .hamburger-menu setzen
      let menuIcon = document.querySelector("header .menu-icon");
      let largeScreen = true;

      if (getComputedStyle(menuIcon).display === "none") {
        menuButton.classList.add("inactive");
      } else {
        menuButton.classList.remove("inactive");
        largeScreen = false;
      }

      //  Menüeinträge auf kleinen Bildschirmen anfangs ausblenden
      // und auf großen Bildschirmen immer anzeigen
      document.querySelectorAll("header .menu-content").forEach(element => {
        if (largeScreen) {
          element.classList.remove("hidden");
        } else {
          element.classList.add("hidden");
        }
      });
    };

    window.addEventListener("resize", () => {
      _initHamburgerMenu();
    });
    _initHamburgerMenu();

  }

  /**
   * Ab hier beginnt die Anwendung zu laufen.
   */
  start() {
    this._router.resolve();
  }

  /**
   * Aufruf der Übersichtsseite der vorhandenen Songs.
   * @return {Boolean} Flag, ob die neue Seite aufgerufen werden konnte
   */
  showSongOverview() {
    let view = new SongOverview(this);
    this._switchVisibleView(view);
  }

  showGameOverview() {
    let view = new GameOverview(this);
    this._switchVisibleView(view);
  }

  showGameRoundsOverview(id) {
    let view = new GameRoundsOverview(this,id);
    this._switchVisibleView(view);
  }

  showRoundOverview(gameRoundId){
    let view = new RoundOverview(this, gameRoundId);
    this._switchVisibleView(view);
  }

  /**
   * Aufruf der Detailseite zur Anzeige oder zum Bearbeiten eines Songs.
   *
   * @param  {String} id Song-ID
   * @param  {String} mode "new", "display" oder "edit"
   * @return {Boolean} Flag, ob die neue Seite aufgerufen werden konnte
   */
  showSongDisplayEdit(id, mode) {
    let view = new SongDisplayEdit(this, id, mode);
    this._switchVisibleView(view);
  }

  showStats() {
    let view = new Stats(this);
    this._switchVisibleView(view);
  }

  showStatsGame(gameName) {
    let view = new GameStats(this, gameName);
    this._switchVisibleView(view);
  }

  showStatsPlayer(playerName) {
    let view = new PlayerStats(this, playerName);
    this._switchVisibleView(view);
  }

  /**
   * Hilfsklasse zum Umschalten auf eine neue Seite. Sie ruft zunächst die
   * Methode onLeave() der gerade sichtbaren View auf und prüft damit, ob
   * die View verlassen werden kann. Falls ja ruft sie die Methode onShow()
   * der neuen View auf und übergibt das Ergebnis an die eigene Methode
   * _switchVisibleContent(), um den sichtbaren Inhalt der Seite auszutauschen.
   *
   * @param  {Object} view View-Objekt mit einer onShow()-Methode
   * @return {Boolean} Flag, ob die neue Seite aufgerufen werden konnte
   */
  async _switchVisibleView(view) {
    let doh = new DataObjectHandler();
    await doh._initData(false);
    // Callback, mit dem die noch sichtbare View den Seitenwechsel zu einem
    // späteren Zeitpunkt fortführen kann, wenn sie in der Methode onLeave()
    // false zurückliefert. Dadurch erhält sie die Möglichkeit, den Anwender
    // zum Beispiel zu fragen, ob er ungesicherte Daten speichern will,
    // bevor er die Seite verlässt.
    let newUrl = this._router.lastRouteResolved().url;
    let goon = () => {
      // ?goon an die URL hängen, weil der Router sonst nicht weiternavigiert
      this._router.navigate(newUrl + "?goon");
    }

    // Aktuelle View fragen, ob eine neue View aufgerufen werden darf
    if (this._currentView) {
      let goonAllowed = await this._currentView.onLeave(goon);

      if (!goonAllowed) {
        this._navAborted = true;
        return false;
      }
    }

    // Alles klar, aktuelle View nun wechseln
    document.title = `${this._title} – ${view.title}`;

    this._currentView = view;
    let content = await view.onShow()
    this._switchVisibleContent(content);
    return true;
  }

  _switchVisibleContent(content) {
    // <header> und <main> des HTML-Grundgerüsts ermitteln
    let app = document.querySelector("#app");
    let header = document.querySelector("#app > header");
    let main = document.querySelector("#app > main");

    // Zuvor angezeigte Inhalte entfernen
    // Bei der Topbar nur die untere Zeile, im Hauptbereich alles!
    app.className = "";
    header.querySelectorAll(".bottom").forEach(e => e.parentNode.removeChild(e));
    main.innerHTML = "";

    // CSS-Klasse übernehmen, um die viewspezifischen CSS-Regeln zu aktivieren
    if (content && content.className) {
      app.className = content.className;
    }

    // Neue Inhalte der Topbar einfügen
    if (content && content.topbar) {
      content.topbar.forEach(element => {
        element.classList.add("bottom");
        header.appendChild(element);
      });
    }

    // Neue Inhalte des Hauptbereichs einfügen
    if (content && content.main) {
      content.main.forEach(element => {
        main.appendChild(element);
      });
    }

    // Navigo an die Links in der View binden
    this._router.updatePageLinks();
  }
}
export default App;

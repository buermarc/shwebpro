'use strict'

import stylesheet from './game-overview.css';
import Database from '../data-access/database-handler.js';
import overview from './game-overview.html';

class GameOverview {
  constructor(app) {
    this._app = app;
    //TODO Search as in song-overview

  }

  async onShow() {

    let container = document.createElement("div");
    container.innerHTML = overview.trim();

    let section = container.querySelector("#game-overview").cloneNode(true);

    this._sortButtons = section.querySelectorAll("header .cmd-sort");
    this._searchField = section.querySelector("header .search");
    this._listElement = section.querySelector("main > ul");

    // this._searchAndUpdateView("", "title");
    //
    // // Event Listener zum Sortieren der Liste
    // this._sortButtons.forEach(element => {
    //   element.addEventListener("click", event => {
    //     this._searchAndUpdateView(this._query, element.dataset.sortBy);
    //     event.preventDefault();
    //   });
    // });
    //
    // // Event Listener zum Suchen von Songs
    // this._searchField.addEventListener("keyup", event => {
    //   if (event.key === "Enter") {
    //     // Bei Enter sofort suchen
    //     this._searchAndUpdateView(this._searchField.value, this._sort);
    //
    //     if (this._searchTimeout) {
    //       window.clearTimeout(this._searchTimeout);
    //       this._searchTimeout = null;
    //     }
    //   } else {
    //     // Bei sonstigem Tastendruck nur alle halbe Sekunde suchen
    //     if (!this._searchTimeout) {
    //       this._searchTimeout = window.setTimeout(() => {
    //         this._searchAndUpdateView(this._searchField.value, this._sort);
    //         this._searchTimeout = null;
    //       }, 500);
    //     }
    //   }
    // });

    return {
      className: "game-overview",
      topbar: section.querySelectorAll("header > *"),
      main: section.querySelectorAll("main > *"),
    };
  }

  async onLeave(goon) {
    return true;
  }

  /**
  * get
  * gOvv = new GameOverview()
  * gOvv.title // calls get title() and returns callback
  */
  get title() {
    return 'Spiele-Übersicht'
  }
}

export default GameOverview

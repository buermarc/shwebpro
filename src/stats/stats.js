'use strict'

import stylesheet from './stats.css';
import stats from './stats.html';
import DataObjectHandler from '../data-access/data-object-handler.js';
import Game from '../data-access/data-objects/game.js';
import Player from '../data-access/data-objects/player.js';
import PlayerToGame from '../data-access/data-objects/player-to-game.js';
import db from '../data-access/database-handler.js'
let database = db.database;

class Stats {
  constructor(app) {
    console.log('asd');
    this._app = app;

    this._tableElement = null;
    this._doh = new DataObjectHandler(true);
  }

  async onShow() {
    let container = document.createElement('div');
    container.innerHTML = stats.trim();

    let section = container.querySelector('#stats').cloneNode(true);

    this._tableElement = section.querySelector('main > table');
    console.log(this._tableElement.innerHTML);

    this._renderTable('null', this._tableElement, this._doh);
    return {
      className: 'stats',
      topbar: section.querySelectorAll('header > *'),
      main: section.querySelectorAll('main > *'),
    };
  }

  async onLeave(goon) {
    return true;
  }

  get title() {
    return 'Statistik'
  }

  async _renderTable(groupBy, parentNode, doh) {
    /**<table>
    <tr>
            <th colspan='2'> Spieler </th>
            <th colspan='2'> game[0] </th>
            ...
            <th colspan='2'> game[n] </th>
            </tr>
     */

    //order the games in alphabetic order
    let games = await doh.getAllGames();
    let players = await doh.getAllPlayers();

    games.sort((a, b) => {
      return a.gameName.localeCompare(b.gameName);
    })

    //order the players in alphabetic order
    players.sort((a, b) => {
      return a.playerName.localeCompare(b.playerName);
    });

    //<tbody> and <tr> with <th>Spieler</th>
    let tbody = document.createElement('tbody');
    let tr = document.createElement('tr');
    tbody.appendChild(tr);
    let th = document.createElement('th');
    th.textContent = 'Spieler';
    tr.appendChild(th);

    //for each game get gameName and create th for it
    games.forEach(game => {
      let thTmp = document.createElement('th');
      thTmp.setAttribute('colspan', 2);
      thTmp.textContent = game.gameName;
      tr.appendChild(thTmp);
    });

    //add win and lose to each game
    tr = document.createElement('tr');
    tbody.appendChild(tr);
    tr.appendChild(document.createElement('td'));
    games.forEach(game => {
      let tdTmp = document.createElement('td');
      tdTmp.textContent = 'Gewonnen';
      tr.appendChild(tdTmp);
      tdTmp = document.createElement('td');
      tdTmp.textContent = 'Verloren';
      tr.appendChild(tdTmp);
    });

    //query all games for each player
    //how to do?: for each player get playerToGame where player
    players.forEach(async player => {
      let trTmp = document.createElement('tr');
      tbody.appendChild(trTmp);
      let tdTmp = document.createElement('td');
      tdTmp.textContent = player.playerName;
      trTmp.appendChild(tdTmp);

      games.forEach(async game => {
        let result = await doh.getGameRoundByPlayerIdAndGameId(player.id, game.id)
        if (result.length != 1) {result = [{win: 0, lose: 0}]};
        tdTmp = document.createElement('td');
        tdTmp.textContent = result[0].win;
        trTmp.appendChild(tdTmp);
        tdTmp = document.createElement('td');
        tdTmp.textContent = result[0].lose;
        trTmp.appendChild(tdTmp);
      });
    });


    //delete what was in parentNode
    while (parentNode.hasChildNodes()) {
      parentNode.removeChild(parentNode.firstChild);
    }

    //append tbody to parentNode
    parentNode.appendChild(tbody);
  }
}

export default Stats;

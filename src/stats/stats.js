'use strict'

import stylesheet from './stats.css';
import stats from './stats.html';
import DataObjectHandler from '../data-access/data-object-handler.js';
import Game from '../data-access/data-objects/game.js';
import Player from '../data-access/data-objects/player.js';
import PlayerToGame from '../data-access/data-objects/player-to-game.js';
import ColorUtils from './color-utils.js'

class Stats {
  constructor(app) {
    this._app = app;

    this._tableElement = null;
    this._doh = new DataObjectHandler(true);
  }

  async onShow() {
    let container = document.createElement('div');
    container.innerHTML = stats.trim();

    let section = container.querySelector('#stats').cloneNode(true);

    this._tableElement = section.querySelector('main > .table');
    this._searchField = section.querySelector("header .search");


    // Event Listener zum Suchen von Songs
    this._searchField.addEventListener("keyup", event => {
      if (event.key === "Enter") {
        // Bei Enter sofort suchen
        console.log('asd');
        this._renderTable(this._searchField.value, this._tableElement, this._doh);

        if (this._searchTimeout) {
          window.clearTimeout(this._searchTimeout);
          this._searchTimeout = null;
        }
      } else {
        // Bei sonstigem Tastendruck nur alle halbe Sekunde suchen
        if (!this._searchTimeout) {
          this._searchTimeout = window.setTimeout(() => {
            this._renderTable(this._searchField.value, this._tableElement, this._doh);
            this._searchTimeout = null;
          }, 500);
        }
      }
    });
    this._renderTable('', this._tableElement, this._doh);

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

  async _renderTable(query, parentNode, doh) {
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

    //get data and enricht it
    let tableContent = await Promise.all(games.map(async game => {
      let result = await doh.getGameRoundByGameId(game.id);
      //enrich with playerName
      result = await Promise.all(result.map(async ele => {
        let playerName = await doh.getPlayerById(ele.playerId);
        playerName = playerName.playerName;
        ele['playerName'] = playerName;
        return ele;
      }));
      result.sort((a, b) => {
        return a.playerName.localeCompare(b.playerName);
      });
      let gameName = await doh.getGameById(game.id);
      gameName = gameName.gameName;
      return {
        gameId: game.id,
        gameName: gameName,
        arr: result
      };
    }));


    //search with query
    if (query != null && query != '') {
      let res1 = tableContent.filter(x => {
        return x.gameName.toUpperCase().search(query.toUpperCase()) > -1;
      });

      let res2 = tableContent.filter(x => {
        let arr = x.arr.map(m => {
          return m.playerName;
        });
        let v = arr.toString().toUpperCase().search(query.toUpperCase()) > -1;
        return v;
      });

      res2 = res2.map(x => {
        x.arr = x.arr.filter(y => {
          return y.playerName.toUpperCase().search(query.toUpperCase()) > -1;
        })
        return x;
      });
      tableContent = res2.concat(res1);
      tableContent = Array.from(new Set(tableContent));
    }

    //sort content after length
    tableContent.sort((a, b) => {
      return a.arr.length > b.arr.length;
    })
    while (parentNode.hasChildNodes()) {
      parentNode.removeChild(parentNode.firstChild);
    }

    let div = document.querySelector('.title');
    div.innerHTML = `
      <div class='noBackButton'><a></a></div>
      <div class='titleName'><a>Gesamtstatisik</a></div>`;

    tableContent.forEach(x => {
      //table-box for game
      let gameColor = ColorUtils.hashStringToColor(x.gameName, 211);
      div = document.createElement('div');
      div.classList.add('table-box')

      //div for gameName
      let tmpDiv = document.createElement('div');
      tmpDiv.classList.add('row');
      tmpDiv.id = 'gameName'

      //create colorstrip for hover
      let eleDiv = document.createElement('div');
      eleDiv.classList.add('colorstrip');
      eleDiv.style.backgroundColor = gameColor;
      tmpDiv.appendChild(eleDiv);

      //create a for text
      let eleA = document.createElement('a');
      eleA.innerHTML = x.gameName;
      tmpDiv.appendChild(eleA);
      tmpDiv.addEventListener('click', () => {
        window.location.href = '#/stats/game/' + x.gameName;
      });
      div.appendChild(tmpDiv);

      //row for 'Gewonnen and Verloren Text'
      tmpDiv = document.createElement('div');
      tmpDiv.classList.add('row');
      tmpDiv.id = 'win-lose'
      div.appendChild(tmpDiv);
      let tmpDiv2 = document.createElement('div');
      tmpDiv2.classList.add('field');
      tmpDiv2.classList.add('win');
      tmpDiv2.classList.add('lose')
      tmpDiv2.classList.add(x.gameName);
      tmpDiv.appendChild(tmpDiv2);
      tmpDiv2 = document.createElement('div');
      tmpDiv2.classList.add('field');
      tmpDiv2.classList.add('win');
      tmpDiv2.classList.add(x.gameName);
      eleA = document.createElement('a');
      eleA.innerHTML = 'Gewonnen';
      tmpDiv2.appendChild(eleA);
      tmpDiv.appendChild(tmpDiv2);
      tmpDiv2 = document.createElement('div');
      tmpDiv2.classList.add('field');
      tmpDiv2.classList.add('lose');
      tmpDiv2.classList.add(x.gameName);
      eleA = document.createElement('a');
      eleA.innerHTML = 'Verloren';
      tmpDiv2.appendChild(eleA);
      tmpDiv.appendChild(tmpDiv2);

      //for each entry create row
      x.arr.forEach(y => {
        //row div
        tmpDiv = document.createElement('div');
        tmpDiv.classList.add('row');
        tmpDiv.classList.add('data');
        div.appendChild(tmpDiv);

        //div for palyerName
        tmpDiv2 = document.createElement('div');
        tmpDiv2.classList.add('field');
        tmpDiv2.classList.add('playerName');

        //colorstrip for hover
        eleDiv = document.createElement('div');
        eleDiv.classList.add('colorstrip');
        eleDiv.style.backgroundColor = ColorUtils.hashStringToColor(y.playerName, 255);
        tmpDiv2.appendChild(eleDiv);

        // a for text playerName
        eleA = document.createElement('a');
        eleA.innerHTML = y.playerName;
        tmpDiv2.appendChild(eleA);
        tmpDiv2.style.backgroundColor = tmpDiv2.addEventListener('click', () => {
          window.location.href = '#/stats/player/' + y.playerName;
        });
        tmpDiv.appendChild(tmpDiv2);

        //div for win
        tmpDiv2 = document.createElement('div');
        tmpDiv2.classList.add('field');
        tmpDiv2.classList.add('win');
        tmpDiv2.classList.add(x.gameName);
        //a for win
        eleA = document.createElement('a');
        eleA.innerHTML = y.win;
        tmpDiv2.appendChild(eleA);
        tmpDiv.appendChild(tmpDiv2);

        //div for lose
        tmpDiv2 = document.createElement('div');
        tmpDiv2.classList.add('field');
        tmpDiv2.classList.add('lose');
        tmpDiv2.classList.add(x.gameName);

        //a for lose
        eleA = document.createElement('a');
        eleA.innerHTML = y.lose;
        tmpDiv2.appendChild(eleA);
        tmpDiv.appendChild(tmpDiv2);

      });
      parentNode.appendChild(div);
      gameColor = ColorUtils.hashStringToColor(x.gameName, 152);
      // document.querySelectorAll('div.field.win.' + x.gameName).forEach(x => x.style.backgroundColor = gameColor);
      // document.querySelectorAll('div.field.lose.' + x.gameName).forEach(x => x.style.backgroundColor = gameColor);
    });
  }

  async _renderTableSimple(groupBy, parentNode, doh) {
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
    th.textContent = '';
    th.classList.add('Spieler');
    tr.appendChild(th);

    //for each game get gameName and create th for it
    games.forEach(game => {
      let thTmp = document.createElement('th');
      thTmp.setAttribute('colspan', 2);
      thTmp.textContent = game.gameName;
      thTmp.classList.add(game.gameName);
      thTmp.classList.add('game');
      tr.appendChild(thTmp);
    });

    //add win and lose to each game
    tr = document.createElement('tr');
    tbody.appendChild(tr);
    tr.appendChild(document.createElement('td'));
    games.forEach(game => {
      let tdTmp = document.createElement('td');
      tdTmp.textContent = 'Gewonnen';
      tdTmp.classList.add(game.gameName);
      tdTmp.classList.add('win');
      tr.appendChild(tdTmp);
      tdTmp = document.createElement('td');
      tdTmp.textContent = 'Verloren';
      tdTmp.classList.add(game.gameName);
      tdTmp.classList.add('lose');
      tr.appendChild(tdTmp);
    });

    //query all games for each player
    //how to do?: for each player get playerToGame where player
    players.forEach(async player => {
      let trTmp = document.createElement('tr');
      tbody.appendChild(trTmp);
      let tdTmp = document.createElement('td');
      tdTmp.textContent = player.playerName
      tdTmp.classList.add('player')
      trTmp.appendChild(tdTmp);

      games.forEach(async game => {
        let result = await doh.getGameRoundByPlayerIdAndGameId(player.id, game.id)
        if (result.length != 1) {
          result = [{
            win: 0,
            lose: 0
          }]
        };
        tdTmp = document.createElement('td');
        tdTmp.textContent = result[0].win;
        tdTmp.classList.add('player-win');
        tdTmp.classList.add(game.gameName);
        trTmp.appendChild(tdTmp);
        tdTmp = document.createElement('td');
        tdTmp.textContent = result[0].lose;
        tdTmp.classList.add('player-lose');
        tdTmp.classList.add(game.gameName);
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

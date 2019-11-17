'use strict'

import stylesheet from './../stats/stats.css';
import stats from './game-stats.html';
import DataObjectHandler from '../data-access/data-object-handler.js';
import Game from '../data-access/data-objects/game.js';
import Player from '../data-access/data-objects/player.js';
import PlayerToGame from '../data-access/data-objects/player-to-game.js';
import ColorUtils from '../stats/color-utils.js'

class GameStats {
  constructor(app, gameName) {
    this._app = app;
    this._gameName = gameName;

    this._tableElement = null;
    this._doh = new DataObjectHandler(true);
  }

  async onShow() {
    let container = document.createElement('div');
    container.innerHTML = stats.trim();

    let section = container.querySelector('#game-stats').cloneNode(true);

    this._tableElement = section.querySelector('main > .table');
    this._searchField = section.querySelector("header .search");

    // TODO later
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
      className: 'stats game',
      topbar: section.querySelectorAll('header > *'),
      main: section.querySelectorAll('main > *'),
    };
  }

  async onLeave(goon) {
    return true;
  }

  get title() {
    return 'Spielestatistik'
  }

  async _renderTable(query, parentNode, doh) {
    //order the games in alphabetic order
    let games = await doh.getAllGames();
    let players = await doh.getAllPlayers();
    let sum = 0;
    let playerSum = 0;

    games.sort((a, b) => {
      return a.gameName.localeCompare(b.gameName);
    })

    //order the players in alphabetic order
    players.sort((a, b) => {
      return a.playerName.localeCompare(b.playerName);
    });

    let tableContent = await Promise.all(games.map(async game => {
      let result = await doh.getGameRoundByGameId(game.id);
      playerSum = result.length;
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

    //leere arrays rausfiltern
    tableContent = tableContent.filter(x => {
      return x.arr.length > 0;
    });

    //filter nach player unabhängig von query da player-stats view
    tableContent = tableContent.filter(x => {
      return x.gameName.search(this._gameName) > -1;
    });
    //normale suche nach spielen
    if (query != null && query != '') {
      tableContent = tableContent.map(x => {
        x.arr = x.arr.filter(y => {
          return y.playerName.toUpperCase().search(query.toUpperCase()) > -1
          || this._gameName.toUpperCase().search(query.toUpperCase()) > -1;
        })
        return x;
      });
    }

    //sort content after length TODO check if length is always one
    tableContent.sort((a, b) => {
      return a.arr.length > b.arr.length;
    })
    // parentNode = parentNode.parentNode;
    while (parentNode.hasChildNodes()) {
      parentNode.removeChild(parentNode.firstChild);
    }
    let div = document.querySelector('.title');
    div.innerHTML = `
      <div class='backButton'><a>＜</a></div>
      <div class='titleName'><a>Zurück zur Gesamtstatisik</a></div>`
    document.querySelector('.backButton').addEventListener('click', () => {
      window.location.href = '#/stats/';
    })

    tableContent.forEach(x => {
      //table-box for each player
      let gameColor = ColorUtils.hashStringToColor(x.gameName, 211);
      let div = document.createElement('div');
      div.classList.add('table-box')

      //div for playerName
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

      //row for Gewonnen und Verloren Text
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

      tmpDiv2 = document.createElement('div');
      tmpDiv2.classList.add('field');
      tmpDiv2.classList.add('sum');
      tmpDiv2.classList.add(x.gameName);
      eleA = document.createElement('a');
      eleA.innerHTML = 'Gesamt Gespielt';
      tmpDiv2.appendChild(eleA);
      tmpDiv.appendChild(tmpDiv2);

      //for each entry create row
      x.arr.forEach(y => {
        tmpDiv = document.createElement('div');
        tmpDiv.classList.add('row');
        tmpDiv.classList.add('data');
        div.appendChild(tmpDiv);

        //div for gameName
        tmpDiv2 = document.createElement('div');
        tmpDiv2.classList.add('field');
        tmpDiv2.classList.add('playerName');

        //colorstrip for hover
        eleDiv = document.createElement('div');
        eleDiv.classList.add('colorstrip');
        eleDiv.style.backgroundColor = ColorUtils.hashStringToColor(y.playerName, 152);
        tmpDiv2.appendChild(eleDiv);

        //a for text gameName
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

        //div for sum
        tmpDiv2 = document.createElement('div');
        tmpDiv2.classList.add('field');
        tmpDiv2.classList.add('sum');
        tmpDiv2.classList.add(x.gameName);

        //a for sum
        eleA = document.createElement('a');
        eleA.innerHTML = (parseInt(y.lose) + parseInt(y.win));
        sum += (parseInt(y.lose) + parseInt(y.win));
        tmpDiv2.appendChild(eleA);
        tmpDiv.appendChild(tmpDiv2);

      });
      parentNode.appendChild(div);
      gameColor = ColorUtils.hashStringToColor(x.gameName, 152);
      // document.querySelectorAll('div.field.win.' + x.gameName).forEach(x => x.style.backgroundColor = gameColor);
      // document.querySelectorAll('div.field.lose.' + x.gameName).forEach(x => x.style.backgroundColor = gameColor);
    });

    div = document.createElement('div');
    div.classList.add('table-box');
    div.classList.add('additionalInformation');
    let tmpDiv = document.createElement('div');
    tmpDiv.classList.add('allRounds');
    tmpDiv.innerHTML = `
      <div class='field allSumTitle'><a>Insgesamt gespielte Runden</a></div>
      <div class='field allSumValue'><a>`+sum+`</a></div>
    `
    div.appendChild(tmpDiv);

    tmpDiv = document.createElement('div');
    tmpDiv.classList.add('allGames');
    tmpDiv.innerHTML = `
      <div class='field allSumTitle'><a>Anzahl der Spieler die dieses Spiel gespielt haben</a></div>
      <div class='field allSumValue'><a>`+playerSum+`</a></div>
    `
    div.appendChild(tmpDiv);
    parentNode.appendChild(div);
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

export default GameStats;

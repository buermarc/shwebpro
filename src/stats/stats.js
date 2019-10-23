'use strict'

import stylesheet from './stats.css';
import stats from './stats.html';
import DataObjectHandler from '../data-access/data-object-handler.js';

class Stats {
  constructor(app) {
    console.log('asd');
    this._app = app;
    new DataObjectHandler();
  }

  async onShow() {
    let container = document.createElement('div');
    container.innerHTML = stats.trim();

    let section = container.querySelector('#stats').cloneNode(true);
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

}

export default Stats;

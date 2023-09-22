import '@babel/polyfill'
import {login } from './login.js';
import { displayMap } from './mapbox.js';

const locations = JSON.parse(document.getElementById('map').dataset.locations);

displayMap(locations)



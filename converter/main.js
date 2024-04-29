import './style.css';
import initState from './src/state';
import update from './src/update';
import view from './src/view';
import app from './src/app';

const node = document.getElementById('app');

app(initState, update, view, node);
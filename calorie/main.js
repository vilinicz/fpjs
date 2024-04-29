import initState from "./src/state.js";
import update from "./src/update.js";
import view from "./src/view.js";
import app from "./src/app.js";
import "./style.css";

const node = document.getElementById("app");

app(initState, update, view, node);

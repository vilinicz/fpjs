import {diff, patch} from 'virtual-dom';
import createElement from 'virtual-dom/create-element';

function app(initState, update, view, node) {
  let state = initState;
  let currentView = view(dispatch, state);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);

  function dispatch(msg) {
    state = update(msg, state);
    const updatedView = view(dispatch, state);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

export default app;
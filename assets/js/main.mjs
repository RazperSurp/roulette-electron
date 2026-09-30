import App from './modules/App.mjs';

window.App = new App(document.getElementById('root'), document.getElementById('panel'));
document.onkeyup = e => {
    if (e.key == 'ArrowDown') window.App.selectedElement = window.App.selectedElement.nextElementSibling ?? window.App.selectedElement.parentNode.childNodes[0];
    else if (e.key == 'ArrowUp') window.App.selectedElement = window.App.selectedElement.previousElementSibling ?? window.App.selectedElement.parentNode.childNodes[window.App.selectedElement.parentNode.childNodes.length - 1];
    else if (e.key == 'Enter') window.App.confirm();
}
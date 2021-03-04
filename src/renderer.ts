import { ipcRenderer as ipc } from 'electron';
let closeButton = document.getElementById('close');
let minButton = document.getElementById('min');
let maxButton = document.getElementById('max');
let winTitle = document.getElementById('window-title');

closeButton.addEventListener('click', function () {
    ipc.send('onClose');
});

minButton.addEventListener('click', function () {
    ipc.send('onMinimize');
});

maxButton.addEventListener('click', function () {
    maxButton.innerHTML = '' + ipc.sendSync('onMaximize');
});

maxButton.innerHTML = '' + ipc.sendSync('checkMaxState');

ipc.on('newTitle', (e, m) => {
    winTitle.innerHTML = '' + m;
});

ipc.on('otherMaximize', (e, m) => {
    maxButton.innerHTML = '' + m;
});

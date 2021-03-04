import { app, BrowserWindow } from 'electron';
import { MainWindow } from './MainWindow';
import { LoadWindow } from './LoadWindow';

export let mw: MainWindow;

function startApp() {
    const lw = new LoadWindow();
    new MainWindow(lw);
}

app.on('ready', () => {
    startApp();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) startApp();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

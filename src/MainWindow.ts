import { BrowserWindow, BrowserView } from 'electron';
import windowStateKeeper = require('electron-window-state');
import { LoadWindow } from './LoadWindow';
import { WindowInterface } from './WindowInterface';

export class MainWindow extends WindowInterface {
    constructor(lw: LoadWindow) {
        super();

        this.self.once('ready-to-show', () => {
            this.self.show();
            setTimeout(() => lw.dispose(), 1000);
        });

        // console.log(this.self.webContents);
    }

    protected basicWindowCreation() {
        let mainWindowState = windowStateKeeper({
            defaultWidth: 1000,
            defaultHeight: 800,
        });

        this.self = new BrowserWindow({
            backgroundColor: '#2f3437',
            x: mainWindowState.x,
            y: mainWindowState.y,
            width: mainWindowState.width,
            height: mainWindowState.height,
            minWidth: 700,
            minHeight: 300,
            // show: false,
            // frame: false,
        });
        // mainWindow.menuBarVisible = false;

        this.self.loadFile('index.html');

        mainWindowState.manage(this.self);

        const view = new BrowserView();
        this.self.addBrowserView(view);
        view.setBounds({
            x: 0,
            y: 0,
            width: mainWindowState.width - 16,
            height: mainWindowState.height - 59,
        });
        view.setAutoResize({
            width: true,
            height: true,
            horizontal: true,
            vertical: true,
        });
        view.webContents.loadURL('https://www.notion.so/login');

        // Open the DevTools.
        view.webContents.openDevTools();
        // this.self.webContents.openDevTools();
    }
}

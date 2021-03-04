import { BrowserWindow, BrowserView } from 'electron';
import windowStateKeeper = require('electron-window-state');
import { LoadWindow } from './LoadWindow';
import { WindowInterface } from './WindowInterface';
import { TitleBar, titleHeight } from './titlebar';

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
            x: mainWindowState.x,
            y: mainWindowState.y,
            width: mainWindowState.width,
            height: mainWindowState.height,
            minWidth: 700,
            minHeight: 300,
            title: 'Notion Desktop',
            // show: false,
            // frame: false,
        });
        // mainWindow.menuBarVisible = false;

        // this.self.loadFile(path.join(__dirname, '../index.html'));
        mainWindowState.manage(this.self);

        new TitleBar(this.self, mainWindowState.width - 16);

        this.notionViewCreation(mainWindowState);
    }

    private notionViewCreation(windowState: windowStateKeeper.State) {
        const view = new BrowserView();
        this.self.addBrowserView(view);
        view.setBounds({
            x: 0,
            y: titleHeight,
            width: windowState.width - 16,
            height: windowState.height - 59 - titleHeight,
            // height: mainWindowState.height - 59,
        });
        view.setAutoResize({
            width: true,
            height: true,
            // horizontal: true,
            // vertical: true,
        });
        view.webContents.loadURL('https://www.notion.so/login');

        // Open the DevTools.
        view.webContents.openDevTools();

        view.webContents.on('page-title-updated', (...args) =>
            this.setPageTitle(args),
        );
    }

    private setPageTitle(args: any) {
        this.self.setTitle(args[1] + ' - Notion Desktop');
    }
}

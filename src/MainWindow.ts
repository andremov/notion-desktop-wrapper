import { BrowserWindow, BrowserView } from 'electron';
import windowStateKeeper = require('electron-window-state');
import * as path from 'path';
import { LoadWindow } from './LoadWindow';
import { WindowInterface } from './WindowInterface';
import { TitleBar, titleHeight } from './titlebar';

export class MainWindow extends WindowInterface {
    private titleBar: TitleBar;
    private notionView: BrowserView;

    constructor(lw: LoadWindow) {
        super();

        this.self.once('ready-to-show', () => {
            this.self.show();
            setTimeout(() => lw.dispose(), 1000);
        });
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
            show: false,
            frame: false,
        });
        // mainWindow.menuBarVisible = false;

        // this.self.loadFile(path.join(__dirname, '../index.html'));
        mainWindowState.manage(this.self);

        this.titleBar = new TitleBar(this, mainWindowState.width);

        this.notionViewCreation(mainWindowState);
    }

    private notionViewCreation(windowState: windowStateKeeper.State): void {
        const view = new BrowserView();
        view.setBackgroundColor('#2f3437');
        this.self.addBrowserView(view);
        view.setBounds({
            x: 0,
            y: titleHeight,
            width: windowState.width,
            height: windowState.height - titleHeight,
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
        // view.webContents.openDevTools();

        view.webContents.on('page-title-updated', (...args) =>
            this.setPageTitle(args),
        );
        this.notionView = view;
    }

    private setPageTitle(args: any) {
        this.self.setTitle(args[1] + ' - Notion Desktop');
        this.titleBar.setTitle(args[1] + ' - Notion Desktop');
    }

    public getTitleBar(): TitleBar {
        return this.titleBar;
    }
}

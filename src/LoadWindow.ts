import { BrowserWindow } from 'electron';
import { WindowInterface } from './WindowInterface';

export class LoadWindow extends WindowInterface {
    protected basicWindowCreation() {
        this.self = new BrowserWindow({
            backgroundColor: '#2f3437',
            width: 300,
            height: 150,
            frame: false,
            alwaysOnTop: true,
        });

        this.self.loadFile('../load.html');
    }
}

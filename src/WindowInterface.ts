import { BrowserWindow } from 'electron';

export abstract class WindowInterface {
    protected self: BrowserWindow;

    constructor() {
        this.basicWindowCreation();
    }

    protected abstract basicWindowCreation(): void;

    public dispose(): void {
        this.self.close();
    }

    public getWindow(): BrowserWindow {
        return this.self;
    }
}

import config from './config.json' with { type: 'json' };
import { app, BrowserWindow, nativeImage } from 'electron';
import type { GameType } from './decl.ts';

export default class Core {

    app: Electron.App;
    win: BrowserWindow;
    mode: GameType | null = null

    constructor(app: Electron.App) {
        this.app = app; 
        this.win = new BrowserWindow(config.browserWindow);
        this.configureWindow();

        this.setPage('index');
    }

    configureWindow(): void {
        // this.win.removeMenu();
        this.win.setIcon(nativeImage.createFromPath(config.logoPath));
    }

    setPage(fileName: string): void {
        this.win.loadFile(`./assets/html/${fileName}.html`);
    }

    setMode(mode: GameType) {
        this.mode = mode;
    }

    static init(): Promise<Core> { 
        return new Promise((resolve, reject) => { app.on('ready', function() { resolve(new Core(app)); }) }) 
    }
}   
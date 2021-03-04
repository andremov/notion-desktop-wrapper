/*
I had to make this because the package 'custom-electron-titlebar':
	https://github.com/AlexTorresSk/custom-electron-titlebar
does not work.
*/

import { BrowserWindow, BrowserView } from 'electron';
import * as path from 'path';
import { ipcMain as ipc } from 'electron';
import { MainWindow } from './MainWindow';
import { mw } from './main';

export const titleHeight = 40;

export class TitleBar {
    private view: BrowserView;

    constructor(window: MainWindow, viewWidth: number) {
        this.view = new BrowserView({
            webPreferences: {
                nodeIntegration: true,
            },
        });
        window.getWindow().addBrowserView(this.view);

        this.view.setBounds({
            x: 0,
            y: 0,
            width: viewWidth,
            height: titleHeight,
        });

        this.view.setAutoResize({
            width: true,
            // height: true,
            // horizontal: true,
            // vertical: true,
        });

        this.view.webContents.loadFile(
            path.join(__dirname, '../title-bar.html'),
        );

        this.view.webContents.openDevTools();

        ipc.on('onClose', function (event, data) {
            window.getWindow().close();
        });

        ipc.on('onMinimize', function (event, data) {
            // if (window.isMinimized()) {
            //     window.restore();
            // } else {
            window.getWindow().minimize();
            // }
        });

        ipc.on('onMaximize', function (event, data) {
            if (window.getWindow().isMaximized()) {
                window.getWindow().unmaximize();
                event.returnValue = 'control_maximize';
            } else {
                window.getWindow().maximize();
                event.returnValue = 'control_restore';
            }
        });

        ipc.on('checkMaxState', function (event, data) {
            if (window.getWindow().isMaximized()) {
                event.returnValue = 'control_restore';
            } else {
                event.returnValue = 'control_maximize';
            }
        });

        window.getWindow().on('maximize', function () {
            mw.getTitleBar()
                .getView()
                .webContents.send('otherMaximize', 'control_restore');
        });

        window.getWindow().on('unmaximize', function () {
            mw.getTitleBar()
                .getView()
                .webContents.send('otherMaximize', 'control_maximize');
        });
    }

    public setTitle(newTitle: string) {
        this.view.webContents.send('newTitle', newTitle);
    }

    public getView(): BrowserView {
        return this.view;
    }

    //
    // private titlebar: HTMLElement;
    // private title: HTMLElement;
    // private dragRegion: HTMLElement;
    // private appIcon: HTMLElement;
    // private menubarContainer: HTMLElement;
    // private windowControls: HTMLElement;
    // private maxRestoreControl: HTMLElement;
    // private container: HTMLElement;
    //
    // private resizer: {
    // 	top: HTMLElement;
    // 	left: HTMLElement;
    // }
    //
    // private isInactive: boolean;
    //
    // private currentWindow: BrowserWindow;
    // private _options: TitlebarOptions;
    // private menubar: Menubar;
    //
    // private events: { [k: string]: Function; };
    //
    // constructor(options?: TitlebarOptions) {
    // 	super();
    //
    // 	this.currentWindow = remote.getCurrentWindow();
    //
    // 	this._options = { ...defaultOptions, ...options };
    //
    // 	this.registerListeners();
    // 	this.createTitlebar();
    // 	this.updateStyles();
    // 	this.registerTheme(this._options.iconsTheme);
    //
    // 	window.addEventListener('beforeunload', () => {
    // 		this.removeListeners();
    // 	});
    // }
    //
    // private closeMenu = () => {
    // 	if (this.menubar) {
    // 		this.menubar.blur();
    // 	}
    // }
    //
    // private registerListeners() {
    // 	this.events = {};
    //
    // 	this.events[EventType.FOCUS] = () => this.onDidChangeWindowFocus(true);
    // 	this.events[EventType.BLUR] = () => this.onDidChangeWindowFocus(false);
    // 	this.events[EventType.MAXIMIZE] = () => this.onDidChangeMaximized(true);
    // 	this.events[EventType.UNMAXIMIZE] = () => this.onDidChangeMaximized(false);
    // 	this.events[EventType.ENTER_FULLSCREEN] = () => this.onDidChangeFullscreen(true);
    // 	this.events[EventType.LEAVE_FULLSCREEN] = () => this.onDidChangeFullscreen(false);
    //
    // 	for (const k in this.events) {
    // 		this.currentWindow.on(k as any, this.events[k]);
    // 	}
    // }
    //
    // // From https://github.com/panjiang/custom-electron-titlebar/commit/825bff6b15e9223c1160208847b4c5010610bcf7
    // private removeListeners() {
    // 	for (const k in this.events) {
    // 		this.currentWindow.removeListener(k as any, this.events[k]);
    // 	}
    //
    // 	this.events = {};
    // }
    //
    // private createTitlebar() {
    // 	// Content container
    // 	this.container = $('div.container-after-titlebar');
    // 	if (this._options.menuPosition === 'bottom') {
    // 		this.container.style.top = BOTTOM_TITLEBAR_HEIGHT;
    // 		this.container.style.bottom = '0px';
    // 	} else {
    // 		this.container.style.top = isMacintosh ? TOP_TITLEBAR_HEIGHT_MAC : TOP_TITLEBAR_HEIGHT_WIN;
    // 		this.container.style.bottom = '0px';
    // 	}
    // 	this.container.style.right = '0';
    // 	this.container.style.left = '0';
    // 	this.container.style.position = 'absolute';
    // 	this.container.style.overflow = this._options.overflow;
    //
    // 	while (document.body.firstChild) {
    // 		append(this.container, document.body.firstChild);
    // 	}
    //
    // 	append(document.body, this.container);
    //
    // 	document.body.style.overflow = 'hidden';
    // 	document.body.style.margin = '0';
    //
    // 	// Titlebar
    // 	this.titlebar = $('div.titlebar');
    // 	addClass(this.titlebar, isWindows ? 'cet-windows' : isLinux ? 'cet-linux' : 'cet-mac');
    //
    // 	if (this._options.order) {
    // 		addClass(this.titlebar, this._options.order);
    // 	}
    //
    // 	if (this._options.shadow) {
    // 		this.titlebar.style.boxShadow = `0 2px 1px -1px rgba(0, 0, 0, .2), 0 1px 1px 0 rgba(0, 0, 0, .14), 0 1px 3px 0 rgba(0, 0, 0, .12)`;
    // 	}
    //
    // 	this.dragRegion = append(this.titlebar, $('div.titlebar-drag-region'));
    //
    // 	// App Icon (Windows/Linux)
    // 	if (!isMacintosh && this._options.icon) {
    // 		this.appIcon = append(this.titlebar, $('div.window-appicon'));
    // 		this.updateIcon(this._options.icon);
    // 	}
    //
    // 	// Menubar
    // 	this.menubarContainer = append(this.titlebar, $('div.menubar'));
    // 	this.menubarContainer.setAttribute('role', 'menubar');
    //
    // 	if (this._options.menu) {
    // 		this.updateMenu(this._options.menu);
    // 		this.updateMenuPosition(this._options.menuPosition);
    // 	}
    //
    // 	// Title
    // 	this.title = append(this.titlebar, $('div.window-title'));
    //
    // 	if (!isMacintosh) {
    // 		this.title.style.cursor = 'default';
    // 	}
    //
    // 	if (IS_MAC_BIGSUR_OR_LATER) {
    // 		this.title.style.fontWeight = "600";
    // 		this.title.style.fontSize = "13px";
    // 	}
    //
    // 	this.updateTitle();
    // 	this.setHorizontalAlignment(this._options.titleHorizontalAlignment);
    //
    // 	// Maximize/Restore on doubleclick
    // 	if (isMacintosh) {
    // 		let isMaximized = this.currentWindow.isMaximized();
    // 		this._register(addDisposableListener(this.titlebar, EventType.DBLCLICK, () => {
    // 			isMaximized = !isMaximized;
    // 			this.onDidChangeMaximized(isMaximized);
    // 		}));
    // 	}
    //
    // 	// Window Controls (Windows/Linux)
    // 	if (!isMacintosh) {
    // 		this.windowControls = append(this.titlebar, $('div.window-controls-container'));
    //
    // 		// Minimize
    // 		const minimizeIconContainer = append(this.windowControls, $('div.window-icon-bg'));
    // 		minimizeIconContainer.title = "Minimize";
    // 		const minimizeIcon = append(minimizeIconContainer, $('div.window-icon'));
    // 		addClass(minimizeIcon, 'window-minimize');
    //
    // 		if (!this._options.minimizable) {
    // 			addClass(minimizeIconContainer, 'inactive');
    // 		} else {
    // 			this._register(addDisposableListener(minimizeIcon, EventType.CLICK, e => {
    // 				this.currentWindow.minimize();
    // 			}));
    // 		}
    //
    // 		// Restore
    // 		const restoreIconContainer = append(this.windowControls, $('div.window-icon-bg'));
    // 		this.maxRestoreControl = append(restoreIconContainer, $('div.window-icon'));
    // 		addClass(this.maxRestoreControl, 'window-max-restore');
    //
    // 		if (!this._options.maximizable) {
    // 			addClass(restoreIconContainer, 'inactive');
    // 		} else {
    // 			this._register(addDisposableListener(this.maxRestoreControl, EventType.CLICK, e => {
    // 				if (this.currentWindow.isMaximized()) {
    // 					this.currentWindow.unmaximize();
    // 					this.onDidChangeMaximized(false);
    // 				} else {
    // 					this.currentWindow.maximize();
    // 					this.onDidChangeMaximized(true);
    // 				}
    // 			}));
    // 		}
    //
    // 		// Close
    // 		const closeIconContainer = append(this.windowControls, $('div.window-icon-bg'));
    // 		closeIconContainer.title = "Close";
    // 		addClass(closeIconContainer, 'window-close-bg');
    // 		const closeIcon = append(closeIconContainer, $('div.window-icon'));
    // 		addClass(closeIcon, 'window-close');
    //
    // 		if (!this._options.closeable) {
    // 			addClass(closeIconContainer, 'inactive');
    // 		} else {
    // 			this._register(addDisposableListener(closeIcon, EventType.CLICK, e => {
    // 				if (this._options.hideWhenClickingClose) {
    // 					this.currentWindow.hide()
    // 				} else {
    // 					this.currentWindow.close()
    // 				}
    // 			}));
    // 		}
    //
    // 		// Resizer
    // 		this.resizer = {
    // 			top: append(this.titlebar, $('div.resizer.top')),
    // 			left: append(this.titlebar, $('div.resizer.left'))
    // 		}
    //
    // 		this.onDidChangeMaximized(this.currentWindow.isMaximized());
    // 	}
    //
    // 	prepend(document.body, this.titlebar);
    // }
    //
    // private onBlur(): void {
    // 	this.isInactive = true;
    // 	this.updateStyles();
    // }
    //
    // private onFocus(): void {
    // 	this.isInactive = false;
    // 	this.updateStyles();
    // }
    //
    // private onMenubarVisibilityChanged(visible: boolean) {
    // 	if (isWindows || isLinux) {
    // 		// Hide title when toggling menu bar
    // 		if (visible) {
    // 			// Hack to fix issue #52522 with layered webkit-app-region elements appearing under cursor
    // 			hide(this.dragRegion);
    // 			setTimeout(() => show(this.dragRegion), 50);
    // 		}
    // 	}
    // }
    //
    // private onMenubarFocusChanged(focused: boolean) {
    // 	if (isWindows || isLinux) {
    // 		if (focused) {
    // 			hide(this.dragRegion);
    // 		} else {
    // 			show(this.dragRegion);
    // 		}
    // 	}
    // }
    //
    // private onDidChangeWindowFocus(hasFocus: boolean): void {
    // 	if (this.titlebar) {
    // 		if (hasFocus) {
    // 			removeClass(this.titlebar, 'inactive');
    // 			this.onFocus();
    // 		} else {
    // 			addClass(this.titlebar, 'inactive');
    // 			this.closeMenu();
    // 			this.onBlur();
    // 		}
    // 	}
    // }
    //
    // private onDidChangeMaximized(maximized: boolean) {
    // 	if (this.maxRestoreControl) {
    // 		if (maximized) {
    // 			removeClass(this.maxRestoreControl, 'window-maximize');
    // 			this.maxRestoreControl.title = "Restore Down"
    // 			addClass(this.maxRestoreControl, 'window-unmaximize');
    // 		} else {
    // 			removeClass(this.maxRestoreControl, 'window-unmaximize');
    // 			this.maxRestoreControl.title = "Maximize"
    // 			addClass(this.maxRestoreControl, 'window-maximize');
    // 		}
    // 	}
    //
    // 	if (this.resizer) {
    // 		if (maximized) {
    // 			hide(this.resizer.top, this.resizer.left);
    // 		} else {
    // 			show(this.resizer.top, this.resizer.left);
    // 		}
    // 	}
    // }
    //
    // private onDidChangeFullscreen(fullscreen: boolean) {
    // 	if (!isMacintosh) {
    // 		if (fullscreen) {
    // 			hide(this.appIcon, this.title, this.windowControls);
    // 		} else {
    // 			show(this.appIcon, this.title, this.windowControls);
    // 		}
    // 	}
    // }
    //
    // private updateStyles() {
    // 	if (this.titlebar) {
    // 		if (this.isInactive) {
    // 			addClass(this.titlebar, 'inactive');
    // 		} else {
    // 			removeClass(this.titlebar, 'inactive');
    // 		}
    //
    // 		const titleBackground = this.isInactive && this._options.unfocusEffect
    // 			? this._options.backgroundColor.lighten(.45)
    // 			: this._options.backgroundColor;
    //
    // 		this.titlebar.style.backgroundColor = titleBackground.toString();
    //
    // 		let titleForeground: Color;
    //
    // 		if (titleBackground.isLighter()) {
    // 			addClass(this.titlebar, 'light');
    //
    // 			titleForeground = this.isInactive && this._options.unfocusEffect
    // 				? INACTIVE_FOREGROUND_DARK
    // 				: ACTIVE_FOREGROUND_DARK;
    // 		} else {
    // 			removeClass(this.titlebar, 'light');
    //
    // 			titleForeground = this.isInactive && this._options.unfocusEffect
    // 				? INACTIVE_FOREGROUND
    // 				: ACTIVE_FOREGROUND;
    // 		}
    //
    // 		this.titlebar.style.color = titleForeground.toString();
    //
    // 		const backgroundColor = this._options.backgroundColor.darken(.16);
    //
    // 		const foregroundColor = backgroundColor.isLighter()
    // 			? INACTIVE_FOREGROUND_DARK
    // 			: INACTIVE_FOREGROUND;
    //
    // 		const bgColor = !this._options.itemBackgroundColor || this._options.itemBackgroundColor.equals(backgroundColor)
    // 			? new Color(new RGBA(0, 0, 0, .14))
    // 			: this._options.itemBackgroundColor;
    //
    // 		const fgColor = bgColor.isLighter() ? ACTIVE_FOREGROUND_DARK : ACTIVE_FOREGROUND;
    //
    // 		if (this.menubar) {
    // 			this.menubar.setStyles({
    // 				backgroundColor: backgroundColor,
    // 				foregroundColor: foregroundColor,
    // 				selectionBackgroundColor: bgColor,
    // 				selectionForegroundColor: fgColor,
    // 				separatorColor: foregroundColor
    // 			});
    // 		}
    // 	}
    // }
    //
    // /**
    //  * get the options of the titlebar
    //  */
    // public get options(): TitlebarOptions {
    // 	return this._options;
    // }
    //
    // /**
    //  * Update the background color of the title bar
    //  * @param backgroundColor The color for the background
    //  */
    // updateBackground(backgroundColor: Color): void {
    // 	this._options.backgroundColor = backgroundColor;
    // 	this.updateStyles();
    // }
    //
    // /**
    //  * Update the item background color of the menubar
    //  * @param itemBGColor The color for the item background
    //  */
    // updateItemBGColor(itemBGColor: Color): void {
    // 	this._options.itemBackgroundColor = itemBGColor;
    // 	this.updateStyles();
    // }
    //
    // /**
    // * Update the title of the title bar.
    // * You can use this method if change the content of `<title>` tag on your html.
    // * @param title The title of the title bar and document.
    // */
    // updateTitle(title?: string) {
    // 	if (this.title) {
    // 		if (title) {
    // 			document.title = title;
    // 		} else {
    // 			title = document.title;
    // 		}
    //
    // 		this.title.innerText = title;
    // 	}
    // }
    //
    // /**
    //  * It method set new icon to title-bar-icon of title-bar.
    //  * @param path path to icon
    //  */
    // updateIcon(path: string) {
    // 	if (path === null || path === '') {
    // 		return;
    // 	}
    //
    // 	if (this.appIcon) {
    // 		this.appIcon.style.backgroundImage = `url("${path}")`;
    // 	}
    // }
    //
    // /**
    //  * Update the default menu or set a new menu.
    //  * @param menu The menu.
    //  */
    // // Menu enhancements, moved menu to bottom of window-titlebar. (by @MairwunNx) https://github.com/AlexTorresSk/custom-electron-titlebar/pull/9
    // updateMenu(menu: Electron.Menu) {
    // 	if (!isMacintosh) {
    // 		if (this.menubar) {
    // 			this.menubar.dispose();
    // 			this._options.menu = menu;
    // 		}
    //
    // 		this.menubar = new Menubar(this.menubarContainer, this._options, this.closeMenu);
    // 		this.menubar.setupMenubar();
    //
    // 		this._register(this.menubar.onVisibilityChange(e => this.onMenubarVisibilityChanged(e)));
    // 		this._register(this.menubar.onFocusStateChange(e => this.onMenubarFocusChanged(e)));
    //
    // 		this.updateStyles();
    // 	} else {
    // 		remote.Menu.setApplicationMenu(menu);
    // 	}
    // }
    //
    // /**
    //  * Update the position of menubar.
    //  * @param menuPosition The position of the menu `left` or `bottom`.
    //  */
    // updateMenuPosition(menuPosition: "left" | "bottom") {
    // 	this._options.menuPosition = menuPosition;
    // 	if (isMacintosh) {
    // 		this.titlebar.style.height = this._options.menuPosition && this._options.menuPosition === 'bottom' ? BOTTOM_TITLEBAR_HEIGHT : TOP_TITLEBAR_HEIGHT_MAC;
    // 		this.container.style.top = this._options.menuPosition && this._options.menuPosition === 'bottom' ? BOTTOM_TITLEBAR_HEIGHT : TOP_TITLEBAR_HEIGHT_MAC;
    // 	} else {
    // 		this.titlebar.style.height = this._options.menuPosition && this._options.menuPosition === 'bottom' ? BOTTOM_TITLEBAR_HEIGHT : TOP_TITLEBAR_HEIGHT_WIN;
    // 		this.container.style.top = this._options.menuPosition && this._options.menuPosition === 'bottom' ? BOTTOM_TITLEBAR_HEIGHT : TOP_TITLEBAR_HEIGHT_WIN;
    // 	}
    // 	this.titlebar.style.webkitFlexWrap = this._options.menuPosition && this._options.menuPosition === 'bottom' ? 'wrap' : null;
    //
    // 	if (this._options.menuPosition === 'bottom') {
    // 		addClass(this.menubarContainer, 'bottom');
    // 	} else {
    // 		removeClass(this.menubarContainer, 'bottom');
    // 	}
    // }
    //
    // /**
    //  * Horizontal alignment of the title.
    //  * @param side `left`, `center` or `right`.
    //  */
    // // Add ability to customize title-bar title. (by @MairwunNx) https://github.com/AlexTorresSk/custom-electron-titlebar/pull/8
    // setHorizontalAlignment(side: "left" | "center" | "right") {
    // 	if (this.title) {
    // 		if (side === 'left' || (side === 'right' && this._options.order === 'inverted')) {
    // 			this.title.style.marginLeft = '8px';
    // 			this.title.style.marginRight = 'auto';
    // 		}
    //
    // 		if (side === 'right' || (side === 'left' && this._options.order === 'inverted')) {
    // 			this.title.style.marginRight = '8px';
    // 			this.title.style.marginLeft = 'auto';
    // 		}
    //
    // 		if (side === 'center' || side === undefined) {
    // 			this.title.style.marginRight = 'auto';
    // 			this.title.style.marginLeft = 'auto';
    // 		}
    // 	}
    // }
    //
    // /**
    //  * Remove the titlebar, menubar and all methods.
    //  */
    // dispose() {
    // 	if (this.menubar) this.menubar.dispose();
    //
    // 	removeNode(this.titlebar);
    //
    // 	while (this.container.firstChild) {
    // 		append(document.body, this.container.firstChild);
    // 	}
    //
    // 	removeNode(this.container);
    //
    // 	this.removeListeners();
    //
    // 	super.dispose();
    // }
}

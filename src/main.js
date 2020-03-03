'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

const electron = require('electron');
const wpilib_NT = require('wpilib-nt-client');
var client = new wpilib_NT.Client();

// The client will try to reconnect after 1 second
client.setReconnectDelay(1000)

/** Module to control application life. */
const app = electron.app;

/** Module to create native browser window.*/
const BrowserWindow = electron.BrowserWindow;

//Module for keyboard shortcuts
const globalShortcut = electron.globalShortcut;

//Module for Menu
const Menu = electron.Menu;

//Module for shell
const Shell = electron.shell;

//Module for custom alert popups
var Alert = require("electron-alert");

//Custom module for saving and loading config
const Config = require("./configuration");
var config = Config.get();

require("./hbs")(config);
// require("./cannicide-handlebars")(config);

    /** Module for receiving messages from the BrowserWindow */
const ipc = electron.ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
/**
 * The Main Window of the Program
 * @type {Electron.BrowserWindow}
 * */
var mainWindow;

let connectedFunc,
    ready = false;

let clientDataListener = (key, val, valType, mesgType, id, flags) => {
    if (val === 'true' || val === 'false') {
        val = val === 'true';
    }
    mainWindow.webContents.send(mesgType, {
        key,
        val,
        valType,
        id,
        flags
    });
};



function createWindow() {
    // Attempt to connect to the localhost
    client.start((con, err) => {

        let connectFunc = () => {
            console.log('Sending status');
            mainWindow.webContents.send('connected', con);

            // Listens to the changes coming from the client
        };

        // If the Window is ready than send the connection status to it
        if (ready) {
            connectFunc();
        }
        connectedFunc = connectFunc;
    });
    // When the script starts running in the window set the ready variable
    ipc.on('ready', (ev, mesg) => {
        console.log('NetworkTables is ready');
        ready = mainWindow != null;

        // Remove old Listener
        client.removeListener(clientDataListener);

        // Add new listener with immediate callback
        client.addListener(clientDataListener, true);

        // Send connection message to the window if if the message is ready
        if (connectedFunc) connectedFunc();
    });
    // When the user chooses the address of the bot than try to connect
    ipc.on('connect', (ev, address, port) => {
        console.log(`Trying to connect to ${address}` + (port ? ':' + port : ''));
        let callback = (connected, err) => {
            console.log('Sending status');
            mainWindow.webContents.send('connected', connected);
        };
        if (port) {
            client.start(callback, address, port);
        } else {
            client.start(callback, address);
        }
    });
    ipc.on('add', (ev, mesg) => {
        client.Assign(mesg.val, mesg.key, (mesg.flags & 1) === 1);
    });
    ipc.on('update', (ev, mesg) => {
        client.Update(mesg.id, mesg.val);
    });
    ipc.on('windowError', (ev, error) => {
        console.log(error);
    });
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1366,
        height: 570,
        frame: false,
        // 1366x570 is a good standard height, but you may want to change this to fit your DriverStation's screen better.
        // It's best if the dashboard takes up as much space as possible without covering the DriverStation application.
        // The window is closed until the python server is ready
        show: false,
        icon: __dirname + '/../images/atom245.png',
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Move window to top (left) of screen.
    //mainWindow.setPosition(0, 0);

    /**
     * Maximize the window automatically, and remove the menu with [File | Edit | View | Window | Help]
     * in order to gain maximum space.
     */
    mainWindow.maximize();
    mainWindow.removeMenu();

    //Flashes the window (orange) for a set amount of time, in ms
        mainWindow.flashFrame(true);
        setTimeout(() => {
            mainWindow.flashFrame(false);
        }, 6000);
    

    

    // Load window.
    mainWindow.loadURL(`file://${__dirname}/index.hbs`);
    // Once the python server is ready, load window contents.
    mainWindow.once('ready-to-show', () => {
        console.log('main window is ready to be shown');
        mainWindow.show();
    });

    
    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        console.log('main window closed');
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
        ready = false;
        connectedFunc = null;
        client.removeListener(clientDataListener);
    });

    mainWindow.on('unresponsive', () => {
        console.log('Main Window is unresponsive');
    });
    mainWindow.webContents.on('did-fail-load', () => {
        console.log('window failed load');
    });

    mainWindow.on("close", (event) => {
        //Nothing for now

    });

    /*globalShortcut.register('f5', function() {
        console.log('f5 is pressed')
        mainWindow.reload();
    })
    globalShortcut.register('CommandOrControl+R', function() {
        console.log('CommandOrControl+R is pressed')
        mainWindow.reload();
    });

    //Temporary devtools:
    globalShortcut.register('CommandOrControl+Shift+I', function() {
        console.log('Devtools opened');
        mainWindow.webContents.openDevTools();
    });*/

}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
    console.log('app is ready');
    createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q.
    // Not like we're creating a consumer application though.
    // Let's just kill it anyway.
    // If you want to restore the standard behavior, uncomment the next line.

    // if (process.platform !== 'darwin')
    app.quit();
});

app.on('quit', function () {
    console.log('Application quit.');
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow == null) createWindow();
});

app.setAsDefaultProtocolClient('dash245');

//Attempt to open the Driver Station if the config allows it:
if (config["open-ds"]) {
    try {
        Shell.openItem("C:\\Program Files (x86)\\FRC Driver Station\\DriverStation.exe");
    }
    catch (err) {
        //Do not open the DriverStation
    }
}

/**
 * Creates a toast popup, where arg is an object {text: x, duration: y, type: z}
 * Where text is a String x, duration is a Number y in seconds, and type is a String z
*/
ipc.on("addToast", (ev, arg) => {

    Alert.fireToast({
        position: "top-end",
        title: `<span style='font-family: "Roboto"; font-size: 9pt;'>${arg.text}</span>`,
        type: arg.type,
        showConfirmButton: false,
        timer: arg.duration * 1000
    });

});

/**
 * Creates a modal popup, where arg is an object {title: a, text: b, type: d}
 * Where title is a String a, text is a String b, and type is a String d
*/
ipc.on("addModal", (ev, arg) => {

    var alert = new Alert();
    alert.fireFrameless({
        position: "center",
        title: arg.title,
        html: `<span style="font-family: Verdana">${arg.text}</span>`,
        type: arg.type,
        showConfirmButton: true
    }, null, true, true);

});

/**
 * Will save the current values in the Values Box widget to the JSON config to be reused later...
 */
ipc.on("saveValuesConfiguration", (ev, arg) => {

    /**
     * Sample arg[] structure:
     * 
     * [
     *  "/SmartDashboard/key1",
     *  "/SmartDashboard/table1/key2",
     *  ...
     * ]
     */
    
     arg = arg || [];

     Config.set("config-values", arg);
});

ipc.on("fetchConfig", (ev, arg) => {
    if (arg) {
        ev.reply("sendConfig", Config.get());
    }
});
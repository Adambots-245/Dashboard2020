//-----------------------Renderer processes------------------------

//Module for Menu
const Menu = require("electron").remote.Menu;

function getMenu() {
    let elec = require("electron").remote;
    let shell = elec.shell;

    const menuTemplate = [

        {
            label: "File",
            submenu: [
                {
                    label: "Refresh Application Page",
                    click: () => {
                        location.reload();
                    }
                },

                {
                    label: "Quit Application",
                    click: () => {
                        elec.app.quit();
                    }
                }
            ]
        },

        {
            label: "View",
            submenu: [
                {
                    label: "View Config",
                    click: () => {
                        
                        shell.openItem(__dirname + "\\storage\\config.json");
                    }
                },

                {
                    label: "Open Driver Station",
                    click: () => {
                        try {
                            shell.openItem("C:\\Program Files (x86)\\FRC Driver Station\\DriverStation.exe");
                        }
                        catch (err) {
                            //Do not open the DriverStation
                            ui.modal({title: "Failed to Open DS", text: "Failed to open DriverStation. This is most likely due to the DriverStation being at a different filepath than the expected C:\\Program Files (x86)\\FRC Driver Station\\DriverStation.exe.", type: "error"});
                        }
                    }
                }
            ]
        },

        {
            label: "Test Widgets",
            submenu: [
                {
                    label: "Test Gyro",
                    click: testers.testGyro
                },

                {
                    label: "Test Timer",
                    click: testers.testTimer
                },

                {
                    label: "Check Camera Stream",
                    click: () => {
                        checkIfStreaming(ui.camera.srcs[ui.camera.id1], (streaming) => {
                            if (streaming) {
                                ui.toast({text: `Camera ${ui.camera.id1 + 1} is streaming`, duration: 5, type: "success"});
                            }
                            else {
                                ui.toast({text: `Camera ${ui.camera.id1 + 1} is not streaming`, duration: 5, type: "error"});
                            }
                        });
                    }
                },

                {
                    label: "Test Voltage Gauge",
                    click: () => {testers.testGauge("volt")}
                },

                {
                    label: "Test Amp-Powerdraw Gauge",
                    click: () => {testers.testGauge("amps/powerdraw")}
                },

                {
                    label: "Test CPU Gradient",
                    click: () => {testers.testRIOGradient("CPU")}
                },

                {
                    label: "Test RAM Gradient",
                    click: () => {testers.testRIOGradient("RAM")}
                },

                {
                    label: "Test Motors Gradient",
                    click: testers.testMotorGradient
                },

                {
                    label: "Test Control Panel Rotate",
                    click: testers.testControlPanelRotate
                },

                {
                    label: "Test Control Panel Align",
                    click: testers.testControlPanelAlign
                },

                {
                    label: "Toggle All Widgets",
                    click: () => {testers.testAll()}
                }
            ]
        }

        /*{
            role: "configuration",
            label: "Configuration",
            submenu: [
                {
                    role: "loadConfig",
                    label: "Load Config",
                    click: () => {
                        config = Config.get();
                        //console.log(config);

                        //Add stuff to do with config here

                    }
                },
                {
                    role: "saveConfig",
                    label: "Save Config",
                    click: () => {
                        Config.setAll(config);
                    }
                },
                {
                    role: "clearConfig",
                    label: "Clear Config",
                    click: () => {
                        config.setAll({elements:[]});
                    }
                }
            ]
        }*/

    ];
    return menuTemplate;
}

//Module for custom titlebar/menu
const customTitlebar = require('custom-electron-titlebar');

/**
 * @type {customTitlebar.Titlebar}
 */
var titlebar;

titlebar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#444444'),
    icon: decodeURIComponent(__dirname).replace(/\\/g, "/").replace("/src", "/images/atom245.png"),
    shadow: true,
    drag: true,
    minimizable: true,
    maximizable: true,
    closeable: true,
    titleHorizontalAlignment: "center",
    menuPosition: "left",
    menu: Menu.buildFromTemplate(getMenu())
});


//-------------------------------------Define UI elements----------------------------------------
let ui = {
    timer: document.getElementById('timer'),
    robotState: document.getElementById('robot-state'),
    gyro: {
        val: 0,
        offset: 0,
        visualVal: 0
    },
    toast: {},
    modal: {},
    sidebar: document.getElementById("sidebar"),
    sidebar_bar: document.getElementById("sidebar-bar"),
    login: {
        box: document.getElementById("connect-address"),
        button: document.getElementById("connect")
    },
    widgets: {},
    maximums: {
        CPU: 100,
        RAM: 100,
        motors: 100
    }
};


//Add toast function:
ui.toast = toast;

//Add modal function:
ui.modal = function({title, text, type}) {
    ipc.send("addModal", {title: title, text: text, type: type});
}

var isComplete = false;


/**
 * The key for time can be either '/robot/time' or '/SmartDashboard/robot/time' depending on your setup
 */
NetworkTables.addKeyListener('/SmartDashboard/robot/time', (key, value) => {
    // This is an example of how a dashboard could display the remaining time in a match.
    // We assume here that value is an integer representing the number of seconds left.

    var minutes =  Math.floor(value / 60);
    var seconds = (value % 60 < 10 ? '0' : '') + value % 60;

    $(ui.timer).find("p")[0].textContent = value < 0 ? '0:00' : minutes + ':' + seconds;

    if (minutes == 0 && !isNaN(seconds) && Number(seconds) <= 30) {
        //Red text when time is running out
    $(ui.timer).find("p").css("animation", "1.5s timerFlash infinite linear");
    }
    if (seconds == 0 && minutes == 0 && !isComplete) {
        ui.toast({text: "Match Complete", duration: 3, type: "warning"});
        isComplete = true;
    }
    else if (Number(seconds) > 30) {
        isComplete = false;
        $(ui.timer).find("p").removeAttr("style");
    }
});

// Load list of prewritten autonomous modes
/*NetworkTables.addKeyListener('/SmartDashboard/autonomous/modes', (key, value) => {
    // Clear previous list
    while (ui.autoSelect.firstChild) {
        ui.autoSelect.removeChild(ui.autoSelect.firstChild);
    }
    // Make an option for each autonomous mode and put it in the selector
    for (let i = 0; i < value.length; i++) {
        var option = document.createElement('option');
        option.appendChild(document.createTextNode(value[i]));
        ui.autoSelect.appendChild(option);
    }
    // Set value to the already-selected mode. If there is none, nothing will happen.
    ui.autoSelect.value = NetworkTables.getValue('/SmartDashboard/currentlySelectedMode');
});*/

// Load list of prewritten autonomous modes
/*NetworkTables.addKeyListener('/SmartDashboard/autonomous/selected', (key, value) => {
    ui.autoSelect.value = value;
});*/

addEventListener('error', (ev) => {
    ipc.send('windowError', { mesg: ev.message, file: ev.filename, lineNumber: ev.lineno })
})


var sidebarIsOpen = false;

ui.sidebar_bar.onclick = function () {
    if (!sidebarIsOpen) {
        //Opens the sidebar
        document.getElementById("sidebar").style.width = "500px";
        document.getElementById("sidebar-bar").innerHTML = "&#9668;";
        document.getElementById("sidebar-content").style.opacity = 1;
        document.getElementById("sidebar-content").style.display = "block";
        sidebarIsOpen = true;
    }
    else {
        //Closes the sidebar
        document.getElementById("sidebar").style.width = "16px";
        document.getElementById("sidebar-bar").innerHTML = "&#9658;";
        document.getElementById("sidebar-content").style.opacity = 0;
        sidebarIsOpen = false;
    }
}





//Drag-and-drop values:

function checkExists(parent, key) {
    var src = $(parent).html();
    if (src.match(`value\=\"${key}\"`)) {
        //Exists
        return true;
    }
    else {
        //Doesn't exist
        return false;
    }
}

function registerRemovers() {
    $("div.key").contextmenu((event) => {
        var elem = event.currentTarget;
        var key = $(elem).attr("value");
        $(elem).remove();

        console.log(`IndexOf ${key}: `, keyset.indexOf(key));
        console.log("Set: ", keyset);

        keyset.splice(keyset.indexOf(key), 1);
        ipc.send("saveValuesConfiguration", keyset);
        ui.toast({text: "Saved Values Config.", duration: 3, type: "success"});
    });
}


    $( "#values-box .content" ).droppable({
        accept: ".sb-key",
        drop: (event, ui) => {
            var elem = ui.draggable;
            var key = elem.html();

            if (!checkExists("#values-box .content", key)) {
                var neatKey = [];
                key.split("/").forEach(item => {neatKey.push(item[0].toUpperCase() + item.substring(1, item.length))});
                neatKey = neatKey.join("/");

                var val = NetworkTables.getValue("/SmartDashboard/" + key, "-");
                $("#values-box .content > .value-container")[0].innerHTML += `<div class="key" value="${key}"><span class="key-box">${neatKey}</span> <span class="val-box">${val}</span></div>`;
                keyset.push(key);
                registerRemovers();

                NetworkTables.addKeyListener("/SmartDashboard/" + key, (k, val) => {
                    $(`#values-box .content > .value-container > div.key[value="${key}"]`).html(`<span class="key-box">${neatKey}</span> <span class="val-box">${val}</span>`);
                });
            }
        }
    });
    
    function makeDraggable() {
        $('#sidebar-content .sb-key').draggable({scroll: false, containment: "document", appendTo: "body", helper: "clone", snap: ".value-container", revert: "invalid"});
    }

    makeDraggable();
    registerRemovers();

//Register keybind shortcut for redisplaying connect-login window

$(document).on("keyup", (event) => {
    if (event.key.toLowerCase() == "c" && !$(event.target).is("input")) {
        $("#connect-button").click();
    }
});

//--------------------------------------HBS Widgets-------------------------------------------\\

// TITLE/INFO LABELS :
function Label(text, type) {

    var elem = `<div class="label-${type}"><p>${text}</p></div>`;
    this.lastParent = null;

    this.insertTo = (parent) => {
        this.lastParent = parent;
        var container = $(parent).find(".label-container")[0];
        container.innerHTML = elem;
        $(parent).css("height", (Number($(parent).css("height").replace("px", "")) + 30 + Number($(parent).css("padding").replace("px", ""))) + "px");
        return this;
    }

    this.updateIn = (parent, heightChange) => {
        this.lastParent = parent;
            if ($(parent + " .label-" + type).length > 0) {
                $(parent + " .label-" + type).html("<p>" + text + "</p>");
            }
            else {
                $(parent)[0].innerHTML += elem;
            }
        if (heightChange) $(parent).css("height", (Number($(parent).css("height").replace("px", "")) + 30 + Number($(parent).css("padding").replace("px", ""))) + "px");
        return this;
    }

    this.addLabel = (label) => {
        $(this.lastParent).find(".label-container")[0].innerHTML += label.toString();
        return this;
    }

    this.toString = () => {
        return elem;
    }

}

function KeyHandler(callback) {

    var keys = {};
    var listeners = {};

    this.handle = (keylist) => {

        keylist.sort();

        keylist.forEach((item) => {
            if (item.match("SmartDashboard")) {
                if (!listeners[item]) listeners[item] = 0;
                if (listeners[item] != 2) {
                    listeners[item]++;
                    callback(item);
                }
            }
        });

    }

    this.getUsedKeys = () => {return keys};
    this.useKey = (key) => {keys[key] = true};

}

function showArrows() {
    var arrows = {
        straight: "||",
        pos1: "|<|",
        pos2: "<|<",
        pos3: "<|"
    };
    
    parseArrowStr(arrows.straight, "straight", [75, 15], 50);
    parseArrowStr(arrows.pos1, "pos1", [100, 15], 50);
    parseArrowStr(arrows.pos2, "pos2", [125, 40], 50);
    parseArrowStr(arrows.pos3, "pos3", [100, 40], 50);
}


//showArrows();
/***/

//Initialize label title of Gyro
new Label("Gyro", "title").insertTo("#gyro");
new Label(`0º`, "info").updateIn("#gyro", false);

//Gyro method:
ui.widgets.updateGyro = (parentID, value) => {

    ui.gyro.val = value;
    ui.gyro.visualVal = Math.floor(ui.gyro.val - ui.gyro.offset);
    ui.gyro.visualVal %= 360;
    if (ui.gyro.visualVal < 0) {
        ui.gyro.visualVal += 360;
    }

    $(`#${parentID} .gyro-img #path9631`).css({'transform-box': 'fill-box', 'transform-origin': 'center', 'transform': `rotate(${ui.gyro.visualVal}deg)`});

    var degrees = new Label(`${ui.gyro.visualVal}º`, "info").updateIn(`#${parentID}`, false);

}

//---

//Create title label for values:
new Label("Values", "title").insertTo("#values-box");

var gaugeOptions = {
    colors: ["yellowgreen", "orangered"],
    IDs: [],
    getColor: function(id) {
        if (this.IDs.indexOf(id) > -1) var colorIndex = this.IDs.indexOf(id);
        else {
            this.IDs.push(id);
            var colorIndex = this.IDs.length - 1;
        }
        var color = this.colors[colorIndex];
        return color;
    }
}

//Gauge Updating Method for any gauge on the page
ui.widgets.updateGauge = (canvasID, value) => {

    $(`#${canvasID}`).gauge(Math.round(value), {
        // Minimum value to display
        min: 0,
        // Maximum value to display
        max: 100,
        // Unit to be displayed after the value
        unit: canvasID == "volts" ? "V" : "A",
        // color for the value and bar
        color: gaugeOptions.getColor(canvasID),
        colorAlpha: 1,
        // background color of the bar
        bgcolor: "#222",
        // default or halfcircle
        type: "default",
        id: canvasID
    });
}

//Update gradients for motors, RAM, and CPU:

var updateGradient = (element, percent) => {
    $(element).css("background", `linear-gradient(to right, var(--gradient-first-stop) 0%, var(--gradient-first-stop) ${percent - 35}%, var(--gradient-last-stop) ${percent + 1}%, var(--gradient-last-stop) 100%)`);
}

ui.widgets.gradientCPU = (elementID, value) => {

    var maxValue = ui.maximums.CPU; //Set to whatever max value will be
    
    var percent = Math.round(value / maxValue * 100);
    $("#" + elementID).find(`#${elementID}-counter`).text(percent + "%");
    updateGradient($(`#${elementID}-icon`), percent);
}

ui.widgets.gradientRAM = (elementID, value) => {

    var maxValue = ui.maximums.RAM; //Set to whatever max value will be

    var percent = Math.round(value / maxValue * 100);
    $(`#${elementID}-counter`).text(percent + "%");
    updateGradient($(`#${elementID}-icon`), percent);
}

ui.widgets.gradientMotor = (elementID, value) => {

    var maxValue = ui.maximums.motors; //Set to whatever max value will be
    
    var percent = Math.round(value / maxValue * 100);
    $(`#${elementID} progress`).attr("val", (percent / 100).toFixed(2));
    updateGradient($(`#${elementID} progress`), percent);
}

//Create the title label for the motors
new Label("Motors", "title").insertTo("#motors-widget")


//Get or Set control panel mode and rotations:

var controlPanel = new ColorWheel("arc", 22.5), setRotationsHandler = false, setAlignHandler = false;

ui.widgets.controlPanel = (subSectionID, value) => {
    
    if (!value || value == 0) return;

    if (value.toLowerCase() == "align") {
        setRotationsHandler = false;

        /*let color = NetworkTables.getValue("/FMSInfo/GameSpecificMessage", "(Unknown Color)").toLowerCase();

        if (color.charAt(0) == "b") color = "Blue";
        else if (color.charAt(0) == "g") color = "Green";
        else if (color.charAt(0) == "r") color = "Red";
        else if (color.charAt(0) == "y") color = "Yellow";
        else color = "Unknown";*/

        let color = renderer.config["control-panel"];
        color = color ? (color["sensor-color"] ? color["sensor-color"] : false) : false;

        $(`#${subSectionID}`).attr("msg", "Align to Color");
        if (!color) return;

        if (!setAlignHandler) {
            NetworkTables.addKeyListener(color, (k, value) => {
                if (setAlignHandler) controlPanel.alignToColor(value == "Unknown" ? "Yellow" : value);
            });
            setAlignHandler = true;
        }
    }
    else if (value.toLowerCase() == "rotate") {
        setAlignHandler = false;

        let rotations = renderer.config["control-panel"];
        rotations = rotations ? (rotations["rotations"] ? rotations["rotations"] : false) : false;

        if (!rotations) return;

        if (!setRotationsHandler) {
            NetworkTables.addKeyListener(rotations, (k, value) => {
                if (setRotationsHandler) {
                    $(`#${subSectionID}`).attr("msg", "Rotations: " + value);

                    controlPanel.spinFullCircle(value);
                }
            });
            setRotationsHandler = true;
        }
        
    }
    else {
        //Invalid Control Panel mode value
        $(`#${subSectionID}`).attr("msg", "Control Panel");
    }

}

//Insert and update all values in sidebar:

var sdHandler = new KeyHandler((key) => {
    if (key.toString().match(/\./)) return;
    console.log("Key: ", key);
    var elem = $("#sidebar-content");
    var uid = key.replace(/\//g, "");

    if (!sdHandler.getUsedKeys()[key]) {
        var v = NetworkTables.getValue(key, "-");
        elem[0].innerHTML += `<div id="key-${uid}"><span class="sb-key">${key.replace("/SmartDashboard/", "")}</span><span class="sb-val">${v}</span></div>`;
        sdHandler.useKey(key);
        makeDraggable();
    }
    else {
        NetworkTables.addKeyListener(key, (k, v) => {
            var item = `#key-${uid}`;
            $(`#sidebar-content ${item} > .sb-val`).html(`${v}`);
        });
    }
});

//Show Auton Mode icons based on Config:

//Create the title label for auton modes
new Label("Autonomous Modes", "title").insertTo("#auton-modes");

function autonIcons() {
    var cmds = renderer.config["auton-commands"], pos1, pos2, pos3, pos4, icon1, icon2, icon3, icon4, iconStr, iconUID = 0;

    pos1 = cmds["pos1"];
    pos2 = cmds["pos2"];
    pos3 = cmds["pos3"];
    pos4 = cmds["pos4"];

    icon1 = $("#hidden-autons .hidden-act1").html();
    icon2 = $("#hidden-autons .hidden-act2").html();
    icon3 = $("#hidden-autons .hidden-act3").html();
    icon4 = $("#hidden-autons .hidden-act4").html();
    iconStr = $("#hidden-autons .hidden-straight").html();

    function autonChecker(item) {
        if (item.match("CrossBaseline") || item.match("DriveStraight")) {
            return [iconStr, false];
        }
        else if (item.match("Push")) {
            return [icon2, false];
        }
        else if (item.match("Yeet")) {
            return [icon4, "Yeet"];
        }
        else if (item.match("Nom")) {
            return [icon1, "Nom"];
        }
        else if (item.match("Snag")) {
            return [icon3, "Snag"];
        }
        else return false;
    }

    function iconInserter(item, index, id) {
        var elem, elemID, num, autonIcon = autonChecker(item);

        if (autonIcon) {
            elemID = "icon" + iconUID;
            elem = autonIcon[0].replace("autonIcon", elemID);
            iconUID += index + 1;

            $("#pos" + id)[0].innerHTML += elem;

            if (autonIcon[1]) {
                var regex = new RegExp(autonIcon[1], "g");
                num = item.replace(regex, "");
                
                $("#" + elemID).parent()[0].innerHTML += `<span class="icon-label">${num == "" ? 1 : num}</span>`;
            }
        }
    }

    pos1.replace(/\&/g, ";").split(";").forEach((item, index) => {
        iconInserter(item, index, 1);
    });

    pos2.replace(/\&/g, ";").split(";").forEach((item, index) => {
        iconInserter(item, index, 2);
    });

    pos3.replace(/\&/g, ";").split(";").forEach((item, index) => {
        iconInserter(item, index, 3);
    });

    pos4.replace(/\&/g, ";").split(";").forEach((item, index) => {
        iconInserter(item, index, 4);
    });

    $("#auton-1").find("p").html(pos1.replace(/;/g, "")).attr("html", pos1.replace(/;/g, ""));
    $("#auton-2").find("p").html(pos2.replace(/;/g, "")).attr("html", pos2.replace(/;/g, ""));
    $("#auton-3").find("p").html(pos3.replace(/;/g, "")).attr("html", pos3.replace(/;/g, ""));
    $("#auton-4").find("p").html(pos4.replace(/;/g, "")).attr("html", pos4.replace(/;/g, ""));
}

autonIcons();


//Select an Auton Mode onclick:

function selectAuton(event) {
    let elem = event.currentTarget;

    let mode = $(elem).find("p").html();
    let autonKey = renderer.config["selected-auton-key"];

    NetworkTables.putValue(autonKey, mode);
    $(".selected-auton").removeClass("selected-auton");
    $(elem).addClass("selected-auton");

    ui.toast({text: `Set Auton Mode to: ${mode}`, duration: 3, type: "success"});
}

$(".auton-mode").on("click", selectAuton);

//Set Selected Auton Mode:

var selectedAutonMode = NetworkTables.getValue(renderer.config["selected-auton-key"]);

if (selectedAutonMode) $(`p[html="${selectedAutonMode.replace("&amp;", "&")}"]`).parent().addClass("selected-auton");
else $("#auton-2").addClass("selected-auton");


//Change Gears color based on team alliance color:

NetworkTables.addKeyListener("/FMSInfo/IsRedAlliance", (key, value) => {

    if (value == true || value == "true") {
        $("#gears i").addClass("redAlliance");
        $("#gears i.blueAlliance").removeClass("blueAlliance");
        $(".auton-straight-baseline").attr("fill", "red");
    }
    else if (value == false || value == "false") {
        $("#gears i").addClass("blueAlliance");
        $("#gears i.redAlliance").removeClass("redAlliance");
        $(".auton-straight-baseline").attr("fill", "blue");
    }
    else {
        $("#gears i.redAlliance").removeClass("redAlliance");
        $("#gears i.blueAlliance").removeClass("blueAlliance");
        $(".auton-straight-baseline").attr("fill", "white");
    }

});


//Set these at the bottom of UI:

setInterval(() => {
    sdHandler.handle(NetworkTables.getKeys());
}, 100);

//window.uiExists = true;

//Triggers a custom UI Initialized events so HBS widgets can use their methods at the correct time...
$(document).trigger("uiInit");

window.onbeforeunload = () => {
    ipc.send("saveValuesConfiguration", keyset);
    ui.toast({text: "Saved Values Config.", duration: 3, type: "success"});
}

var set = renderer.config["config-values"];
set.forEach((item) => {resolveConfigValues(item)});
registerRemovers();
// Define UI elements
let ui = {
    timer: document.getElementById('timer'),
    robotState: document.getElementById('robot-state').firstChild,
    gyro: {
        container: document.getElementById('gyro'),
        val: 0,
        offset: 0,
        visualVal: 0,
        arm: document.getElementById('gyro-arm'),
        number: document.getElementById('gyro-number')
    },
    robotDiagram: {
        arm: document.getElementById('robot-arm'),
        svg: document.getElementById('robot-diagram'),
        arm_placeholder: document.getElementById("robot-arm-placeholder"),
        rotationalsvg: document.getElementById("arm-rotational")
    },
    autoSelect: document.getElementById('auto-select'),
    armPosition: document.getElementById('arm-position'),
    toggleFrame: document.getElementById("toggleFrame"),
    toast: {},
    sidebar: document.getElementById("sidebar")
};


//Add toast function:
ui.toast = function ({text, duration, type}) {
    ipc.send("addToast", {text: text, duration: duration, type: type});
};

// Key Listeners

// Gyro rotation
let updateGyro = (key, value) => {
    ui.gyro.val = value;
    ui.gyro.visualVal = Math.floor(ui.gyro.val - ui.gyro.offset);
    ui.gyro.visualVal %= 360;
    if (ui.gyro.visualVal < 0) {
        ui.gyro.visualVal += 360;
    }
    ui.gyro.arm.style.transform = `rotate(${ui.gyro.visualVal}deg)`;
    ui.gyro.arm.style.transformOrigin = `50% 50%`;
    ui.gyro.number.textContent = ui.gyro.visualVal + 'º';
};
NetworkTables.addKeyListener('/SmartDashboard/Gyro', updateGyro);

// The following case is an example, for a robot with an arm at the front.
NetworkTables.addKeyListener('/SmartDashboard/arm/encoder', (key, value) => {
    // 0 is all the way back, 1200 is 45 degrees forward. We don't want it going past that.
    if (value > 1200) {
        value = 1200;
    }
    else if (value < 0) {
        value = 0;
    }
    // Calculate visual rotation of arm
    //var armAngle = value * 3 / 20 - 45;
    
    //var armAngle = (value * 3 / 8) + 180; - My formula
    var armAngle = (value / 1200 * 45) + 180;

    // Rotate the arm in diagram to match real arm
    ui.robotDiagram.rotationalsvg.style.transformOrigin = `50% 50%`;
    ui.robotDiagram.rotationalsvg.style.transform = `rotate(${armAngle}deg)`;
});

//Set robot arm to initial position
ui.robotDiagram.rotationalsvg.style.transformOrigin = `50% 50%`;
ui.robotDiagram.rotationalsvg.style.transform = `rotate(180deg)`;

// This button is just an example of triggering an event on the robot by clicking a button.
NetworkTables.addKeyListener('/SmartDashboard/example_variable', (key, value) => {
    // Set class active if value is true and unset it if it is false
    ui.example.button.classList.toggle('active', value);
    ui.example.readout.data = 'Value is ' + value;
});

NetworkTables.addKeyListener('/robot/time', (key, value) => {
    // This is an example of how a dashboard could display the remaining time in a match.
    // We assume here that value is an integer representing the number of seconds left.
    ui.timer.textContent = value < 0 ? '0:00' : Math.floor(value / 60) + ':' + (value % 60 < 10 ? '0' : '') + value % 60;
});

// Load list of prewritten autonomous modes
NetworkTables.addKeyListener('/SmartDashboard/autonomous/modes', (key, value) => {
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
});

// Load list of prewritten autonomous modes
NetworkTables.addKeyListener('/SmartDashboard/autonomous/selected', (key, value) => {
    ui.autoSelect.value = value;
});


// Reset gyro value to 0 on click
ui.gyro.container.onclick = function () {
    // Store previous gyro val, will now be subtracted from val for callibration
    ui.gyro.offset = ui.gyro.val;
    // Trigger the gyro to recalculate value.
    updateGyro('/SmartDashboard/drive/navx/yaw', ui.gyro.val);
    ui.toast({text: "Reset Gyro.", duration: 3, type: "success"});
};
// Update NetworkTables when autonomous selector is changed
ui.autoSelect.onchange = function () {
    NetworkTables.putValue('/SmartDashboard/autonomous/selected', this.value);
};
// Get value of arm height slider when it's adjusted
ui.armPosition.oninput = function () {
    NetworkTables.putValue('/SmartDashboard/arm/encoder', parseInt(this.value));
};

addEventListener('error', (ev) => {
    ipc.send('windowError', { mesg: ev.message, file: ev.filename, lineNumber: ev.lineno })
})

ipc.on("receiveFrame", (ev, arg) => {

    ui.toggleFrame.setAttribute("val", arg);

});

ui.toggleFrame.onclick = () => {

    ui.toast({text: "Added/Removed Frame.", duration: 3, type: "success"});
    ipc.send("toggleFrame", "toggle");

}

var sidebarIsOpen = false;

ui.sidebar.onclick = function () {
    if (!sidebarIsOpen) {
        //Opens the sidebar
        document.getElementById("sidebar").style.width = "500px";
        document.getElementById("sidebar_bar").innerHTML = "&#9668;";
        sidebarIsOpen = true;
    }
    else {
        //Closes the sidebar
        document.getElementById("sidebar").style.width = "12px";
        document.getElementById("sidebar_bar").innerHTML = "&#9658;";
        sidebarIsOpen = false;
    }
}
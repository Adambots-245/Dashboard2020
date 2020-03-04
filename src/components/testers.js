//A development/debug only component for testing the features of dashboard;
//Write a runnable function for each test and call the function in the custom-electron-titlebar initialization (top of ui.js)

function toast({text, duration, type}) {
    ipc.send("addToast", {text: text, duration: duration, type: type});
}

var testers = {};

//---------------------------------Widget testers------------------------------------\\
//---------------(put values onto network tables to test widgets:)--------------------\\


function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//Test code for gyro:
testers.testGyro = function() {
    toast({text: "Testing Gyro", duration: 3, type: "success"});
    var initialValue = 1001;
    var gyroValue = randomIntFromInterval(0, 360);
    setInterval(() => {
    initialValue++;
    NetworkTables.putValue(renderer.config["gyro-key"], gyroValue);  
    gyroValue += 10;
    if (gyroValue > 360)
        gyroValue = 0;
    }, 20);
}



 //Test code for testing the robot match-time clock:
 testers.testTimer = function() {
    toast({text: "Testing Timer", duration: 3, type: "success"});

    var time = 46;
    setInterval(() => {

    time -= 1;
    NetworkTables.putValue("/SmartDashboard/robot/time", time);

    if (time < -5) time = 126;

    }, 1000);
}

testers.testGauge = function(type) {

    if (type == "volt") var table = renderer.config["voltage-key"];
    else var table = renderer.config["powerdraw-key"];

    var power = 100;
    setInterval(() => {
        NetworkTables.putValue(table, power);
        power--;

        if (power < 0) power = 100;
    }, 100)

}

testers.testRIOGradient = function(type) {

    if (type == "CPU") var table = renderer.config["cpu-key"];
    else var table = renderer.config["ram-key"];

    var percent = 0;
    setInterval(() => {
        NetworkTables.putValue(table, percent);
        percent++;

        if (percent > 100) percent = 0;
    }, 500);

}

testers.testMotorGradient = function() {

    var table = renderer.config["motor-keys"];
    var start = 0;


    Object.keys(table).forEach((key) => {
        var percent = start, entry = table[key];

        start += 2;

        setInterval(() => {
            NetworkTables.putValue(entry, percent);
            percent++;

            if (percent > 100) percent = 0;
        }, 500);
    });

}

var t_alignTimer, t_rotateTimer;

testers.testControlPanelAlign = function() {
    clearInterval(t_alignTimer);
    clearInterval(t_rotateTimer);

    var table = renderer.config["control-panel"]["mode"], color = renderer.config["control-panel"]["sensor-color"];
    //var colors = ["Blue", "Red", "Green", "Yellow"];
    var colors = ["Blue", "Yellow", "Red", "Green"];
    //var index = (Math.floor(Math.random() * colors.length) + 1) - 1;
    var index = 1;

    NetworkTables.putValue(table, "Align");

    //NetworkTables.putValue("/FMSInfo/GameSpecificMessage", colors[index]);

    t_alignTimer = setInterval(() => {
        NetworkTables.putValue(color, colors[index]);
        index += 1;
        if (index >= colors.length) index = 0;
    }, 500);

}

testers.testControlPanelRotate = function() {
    clearInterval(t_alignTimer);
    clearInterval(t_rotateTimer);

    var table = renderer.config["control-panel"]["mode"], rot = renderer.config["control-panel"]["rotations"];
    var rounds = 0;

    NetworkTables.putValue(table, "Rotate");

    t_rotateTimer = setInterval(() => {
        NetworkTables.putValue(rot, rounds);
        rounds += 1;
        if (rounds > 5) rounds = 0;
    }, 1000);

}

testers.testAll = function() {
    Object.keys(this).forEach((item) => {
        if (item == "testAll") {
            //Prevent infinite loop by catching this case
        }
        else if (item == "testGauge") {
            testers[item]("volt");
            setTimeout(() => {testers[item]("powerdraw")}, 1000);
        }
        else if (item == "testRIOGradient") {
            testers[item]("CPU");
            setTimeout(() => {testers[item]("RAM")}, 1000); 
        }
        else {
            if (typeof testers[item] == "function") testers[item]();
        }
    });
}
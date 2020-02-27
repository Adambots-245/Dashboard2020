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
    NetworkTables.putValue("/SmartDashboard/Gyro", gyroValue);  
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

    if (type == "volt") var table = "voltage";
    else var table = "powerdraw";

    var power = 100;
    setInterval(() => {
        NetworkTables.putValue("/SmartDashboard/robot/" + table, power);
        power--;

        if (power < 0) power = 100;
    }, 100)

}

testers.testRIOGradient = function(type) {

    if (type == "CPU") var table = "CPU";
    else var table = "RAM";

    var percent = 0;
    setInterval(() => {
        NetworkTables.putValue("/SmartDashboard/robot/" + table, percent);
        percent++;

        if (percent > 100) percent = 0;
    }, 500);

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
            testers[item]();
        }
    });
}
//A development/debug only component for testing the features of dashboard;
//Write a runnable function for each test and call the function in the custom-electron-titlebar initialization (top of ui.js)

function toast({text, duration, type}) {
    ipc.send("addToast", {text: text, duration: duration, type: type});
}

//---------------------------------Widget testers------------------------------------\\
//---------------(put values onto network tables to test widgets:)--------------------\\


function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//Test code for gyro:
function testGyro() {
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
 function testTimer() {
    toast({text: "Testing Timer", duration: 3, type: "success"});

    var time = 46;
    setInterval(() => {

    time -= 1;
    NetworkTables.putValue("/SmartDashboard/robot/time", time);

    if (time < -5) time = 126;

    }, 1000);
}

function testGauge(type) {

    if (type == "volt") var table = "voltage";
    else var table = "powerdraw";

    var power = 100;
    setInterval(() => {
        NetworkTables.putValue("/SmartDashboard/robot/" + table, power);
        power--;

        if (power < 0) power = 100;
    }, 100)

}
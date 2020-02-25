//Save and obtain table configurations for the dashboard
const fs = require("fs");
const configSrc = (getDir() + "\\storage\\config.json").replace(/\\/g, "/").replace("components/", "");


function getDir() {
    return __dirname;
}

function getConfiguration() {

    try {
        //Gets json file with config settings, and converts into JS object
        var config = JSON.parse(fs.readFileSync(configSrc));
    }
    catch (err) {
        console.log("Reading JSON was not possible due to error: " + err);
        return false;
    }

    //Sample config.json format:

    /*
        {
            "elements": [
                {
                    "key": "name",
                    "type": "boolean",
                    "widget": "none"
                }
            ]
        }
    */

   //Where "key" is the key name at which the respective data is stored in the network table (including the path),
   //"type" is the datatype the data is stored as (i.e. boolean, string, number, etc.),
   //and "widget" is the name (or none) of the widget to use (i.e. gyro chart, speedometer, etc.)

   //Returns the config
   return config;

}

function setConfiguration(key, value) {

    //Gets the current array of dashboard elements in the config.json file
    var currentConfig = getConfiguration();

    if (!currentConfig) {
        console.log("Unable to set the configuration; could not get the current configuration.");
        return false;
    }

    currentConfig[key] = value;

    //Updates json file with new config additions/updates
    fs.writeFileSync(configSrc, JSON.stringify(currentConfig, null, "\t"));

}

module.exports = {
    get: () => {return getConfiguration()},
    set: setConfiguration,
    setAll: (config) => {
        fs.writeFileSync(configSrc, JSON.stringify(config));
    }
}


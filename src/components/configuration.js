//Save and obtain table configurations for the dashboard
const fs = require("fs");
const configSrc = "../storage/config.json";

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
                    "content": "false",
                    "widget": "none"
                }
            ]
        }
    */

   //Where "key" is the key name at which the respective data is stored in the network table (including the path),
   //"type" is the datatype the data is stored as (i.e. boolean, string, number, etc.),
   //"content" is the last known value of the data,
   //and "widget" is the name (or none) of the widget to use (i.e. gyro chart, speedometer, etc.)

   //Returns the array of dashboard elements
   return config.elements;

}

function setConfiguration(path, type, content) {

    //Gets the current array of dashboard elements in the config.json file
    var currentConfig = getConfiguration();

    if (!currentConfig) {
        console.log("Unable to set the configuration; could not get the current configuration.");
        return false;
    }

    var isItem = false;
    currentConfig.forEach((item, index) => {

        //Updates item if it already exists
        if (item.key == path) {
            isItem = true;
            currentConfig[index].type = type;
            currentConfig[index].content = content;
        }

    });

    //Adds item if it does not exist
    if (!isItem) {

        currentConfig.push({
            key: path,
            type: type,
            content: content
        });

    }

    //Updates json file with new config additions/updates
    fs.writeFileSync(configSrc, JSON.stringify(currentConfig));

}

module.exports = {
    get: getConfiguration,
    set: setConfiguration
}
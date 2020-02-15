//Autovalues.js retrieves and posts network table values (the ones configured in config.json) to the dashboard
//It also uses custom widgets whenever specified in the config

var config = require("./configuration");

function loadConfig() {

    var tables = config.get();

    NetworkTables.getKeys().forEach((tableKey) => {

        var tableKeyExists = false;

        tables.forEach((item, index) => {

            
            var targetKey, type, widget;

            targetKey = item.key;
            type = item.type.toLowerCase();
            widget = item.widget.toLowerCase();

            if (tableKey == '/SmartDashboard/' + targetKey) {
                tableKeyExists = true;
                NetworkTables.addKeyListener('/SmartDashboard/' + targetKey, (key, val) => {

                    //findWidget(widget, type)(elem, key, val);
                });
            }


        });

    });

}
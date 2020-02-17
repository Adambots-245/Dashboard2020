//Autovalues.js retrieves and posts network table values (the ones configured in config.json) to the dashboard
//It also uses custom widgets whenever specified in the config

var widgetsRight = new widgetPanel();
widgetsRight.init("Widgets Right", "widgetsRight");


function loadConfig() {

    var tables = config.get();
    var id = 0;


        tables.forEach((item, index) => {

            
            var targetKey, initial, widget, title, location;

            targetKey = item.key;
            initial = item.initial;
            widget = item.widget.toLowerCase();
            location = item.location.toLowerCase();
            title = item.title;

            
            if (widget == "label" || widget == "none" || !widget) {
                var lw = new labelWidget();
                lw.init(title, targetKey);

                if (location == "right") {
                    widgetsRight.add(lw, initial);
                }
            }
        


        });

}

loadConfig();
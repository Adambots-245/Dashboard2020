

init()

/**
 * This adds buttons for all of the button command stuff in the code.
 */
function init() {
    console.log(NetworkTables.getKeys().length);
    
    NetworkTables.getKeys().forEach(item => {
        if (item.startsWith("/SmartDashboard/ButtonCommand/") && item.endsWith("/running")) {
            //name of command to set to a button
            var name = item.substring(30);
            name = name.substring(0, name.length - 8);

            var buttonCommand = new Widget(name, "widgetsRight", makeButton);
            buttonCommand.display(name);

            setTimeout(() => {document.getElementById(name).onclick = function() {
                //toggle check to set on and off
                if (NetworkTables.getValue("/SmartDashboard/ButtonCommand/" + name + "/running")) {
                    NetworkTables.putValue("/SmartDashboard/ButtonCommand/" + name + "/running", false);
                } else {
                    NetworkTables.putValue("/SmartDashboard/ButtonCommand/" + name + "/running", true);
                }
            }},100);
            
        }
    });    
}

/**
 * Actually makes the button
 * @param {String} name | The name of the command that will be displayed
 */
function makeButton(name) {
    //document.getElementById("workspace").innerHTML +=`<button class="command" id='${name}'>${name}</button>`;
        

    return `<button class="command" id='${name}'>${name}</button>`;
}
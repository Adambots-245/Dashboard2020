//draws buttons
init()

function init() {
    console.log(NetworkTables.getKeys().length);
    
    NetworkTables.getKeys().forEach(item => {
        if (item.startsWith("/SmartDashboard/ButtonCommand/") && item.endsWith("/running")) {
            //name of command to set to a button
            var name = item.substring(30);
            name = name.substring(0, name.length - 8);            

            //to add the button
            document.getElementById("workspace").innerHTML +=`<button class="command" id='${name}'>${name}</button>`;
            
            //to be able to click the button, the timeout is there because it 
            //was going to fast and was making it so only like the last one was clickable
            setTimeout(() => {document.getElementById(name).onclick = function() {
               click(this.id);
            }},100);
        }
    });    
}

function click(name) {

    //toggle check to turn the command off and on
    if (NetworkTables.getValue("/SmartDashboard/ButtonCommand/" + name + "/running")) {
        NetworkTables.putValue("/SmartDashboard/ButtonCommand/" + name + "/running", false);
    } else {
        NetworkTables.putValue("/SmartDashboard/ButtonCommand/" + name + "/running", true);
    }
}
var id = 0;

function init() {
    NetworkTables.getKeys().forEach(item => {
        if (item.startsWith("\\ButtonCommand\\")) {
            NetworkTables.putValue("\\ButtonCommand\\" + item + "\\id:", id++);
            document.getElementById("workspace").innerHTML += "<svg>"
        }
    });
}


var label = new Widget("label", "widgetsRight", (key, value) => {

    var elem = `<div class="label"><p class="nt_key">${key}</p><br><p class="nt_value">${value}</p></div>`;

    return elem;


});

label.display("Example", "Value");
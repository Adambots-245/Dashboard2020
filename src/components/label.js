

var label = new Widget("label", (key, value) => {

    var elem = document.createElement(`p`);
    elem = $(elem).addClass("nt_value").html(value);

    return elem;


});

label.add("mainbody");
label.display("Example", "Value");
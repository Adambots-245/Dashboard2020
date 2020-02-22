// /**
//  * Represents a Widget Panel, in which other widgets are placed.
//  */
// class widgetPanel extends Widget(panelInterface){
//     constructor(){
//         super();
//     }

//     init(title, elemid){
//         this.title = title;

//         this.elem = document.getElementById(elemid);
//         this.widgets = [];
//         this.lastId = -1;
//     }

//     add(widget, initialValue){
//         this.lastId++;
//         this.widgets[this.lastId] = widget;
//         NetworkTables.addKeyListener(widget.data, (key, value) => {
//             // console.log(value);
//             widget.update(value); 
//             // console.log(widget);
//         });
//         this.elem.innerHTML += widget.render(this.lastId, initialValue);
//     }

//     remove(widget){
//         //Not necessary for now, but the following should remove the widget:
//         document.getElementById(widget.id).parentNode.removeChild(document.getElementById(widget.id));
//     }
// }

// /**
//  * Represents a label widget, which displays simple text.
//  */
// class labelWidget extends Widget(widgetInterface) {
//     constructor() {
//       super();
//     }

//     init(title, key){
//         this.title = title;
//         this.data = "/SmartDashboard/" + key;
//     }

//     /*data(key){
//         this.data = "/SmartDashboard/" + key;
//     }*/

//     render(id, value){
//         this.value = value;
//         this.id = 'label.' + id;

//         // console.log(`"${this.title}"`);
//         var elem = `<div class="label" id="${this.id}"><p class="nt_key">${this.title}</p><br><p class="nt_value">${this.value}</p></div>`;

//         return elem;
//     }

//     update(value){
//         var elem = document.getElementById(this.id);

//         elem.querySelector(".nt_value").innerHTML = value;
//     }
//   }

//   /* \\For testing purposes:
  
//   lw = new labelWidget();
//   lw.init("Test", "widgets/test");
//   //lw.data("widgets/test");
  
//   panel = new widgetPanel();
//   panel.init("Right", "widgetsRight");

//   panel.add(lw, 1001);

//   lw2 = new labelWidget();
//   lw2.init("Angle");
//   lw2.data("widgets/angle");


//   panel.add(lw2, 0);*/

//   /* More test code: and it works!
  
//   var initialValue = "example value";
//   setInterval(() => {
//     NetworkTables.putValue("/SmartDashboard/ExampleKey", initialValue);  
//     initialValue+=" 2";
//   }, 2000);*/


//--------------------------------Widgets------------------------------\\

// TITLE/INFO LABELS :

function Label(text, type) {

    var elem = `<div class="label-${type}"><p>${text}</p></div>`;
    this.lastParent = null;

    this.insertTo = (parent) => {
        this.lastParent = parent;
        $(parent).find(".label_container")[0].innerHTML = elem;
        return this;
    }

    this.addLabel = (label) => {
        $(this.lastParent).find(".label_container")[0].innerHTML += label.toString();
        return this;
    }

    this.toString = () => {
        return elem;
    }

}


//GYRO :   

  //Initialize label title of Gyro
  new Label("Gyro", "title").insertTo("#gyro").addLabel(new Label(`0º`, "info"));

  /**
  NetworkTables.addKeyListener("SmartDashboard/Gyro", (key, value) => {

    // let needleElement = 
    ui.gyro.val = value;
    ui.gyro.visualVal = Math.floor(ui.gyro.val - ui.gyro.offset);
    ui.gyro.visualVal %= 360;
    if (ui.gyro.visualVal < 0) {
        ui.gyro.visualVal += 360;
    }

    $(`#gyro-img #path9631`).css({'transform-box': 'fill-box', 'transform-origin': 'center', 'transform': `rotate(${ui.gyro.visualVal}deg)`});

    var degrees = new Label(`${ui.gyro.visualVal}º`, "info");
    var title = new Label("Gyro", "title").insertTo("#gyro").addLabel(degrees);


    //$(`#${this.widgetId}`).html(templateFn(jsonData));
});
**/

// AUTONOMOUS MODES :

//Create the title label for auton modes
new Label("Autonomous Modes", "title").insertTo("#auton_modes");

NetworkTables.addKeyListener("/SmartDashboard/autonomous/modes", (key, value) => {



});



// MOTORS STATUS :

//Create the title label for the motors
new Label("Motors", "title").insertTo("#motors_widget")








//------------------------------------Labels---------------------------------\\
//-----------Automagically add title labels through data attributes-----------\\







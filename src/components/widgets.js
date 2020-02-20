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

$.ajax({
    url: `widgets/gyro/gyro.html`,
    cache: true,
    async: false,
    success: function(data) {
      let source    = data;
        $('#widgetsRight')[0].innerHTML += source;
      
    }               
  });   

  NetworkTables.addKeyListener("SmartDashboard/Gyro", (key, value) => {

    // let needleElement = 

    $(`#gyro-img #path9631`).css({'transform-box': 'fill-box', 'transform-origin': 'center', 'transform': `rotate(${value})`});

    //$(`#${this.widgetId}`).html(templateFn(jsonData));
});




















//---------------------------------Widget testers------------------------------------\\
//---------------(put values onto network tables to test widgets:)--------------------\\


 function randomIntFromInterval(min, max) { // min and max included 
     return Math.floor(Math.random() * (max - min + 1) + min);
}

//Test code for gyro:
var initialValue = 1001;
var gyroValue = randomIntFromInterval(0, 360);
  setInterval(() => {
    initialValue++;
    NetworkTables.putValue("SmartDashboard/Gyro", gyroValue + "deg");  
    gyroValue += 10;
    if (gyroValue > 360)
        gyroValue = 0;
    // ui.toast({text: initialValue, duration: 3, type: "success"});
    // lw.update(initialValue++);
  }, 200);



  
  //Test code for testing the robot match-time clock:
/*var time = 46;

setInterval(() => {

time -= 1;
NetworkTables.putValue("/robot/time", time);

if (time < -5) time = 126;

}, 1000);*/
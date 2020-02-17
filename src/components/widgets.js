/**
 * Represents a Widget Panel, in which other widgets are placed.
 */
class widgetPanel extends Widget(panelInterface){
    constructor(){
        super();
    }

    init(title, elemid){
        this.title = title;

        this.elem = document.getElementById(elemid);
        this.widgets = [];
        this.lastId = -1;
    }

    add(widget, initialValue){
        this.lastId++;
        this.widgets[this.lastId] = widget;
        NetworkTables.addKeyListener(widget.data, (key, value) => {
            // console.log(value);
            widget.update(value); 
            // console.log(widget);
        });
        this.elem.innerHTML += widget.render(this.lastId, initialValue);
    }

    remove(widget){
        //Not necessary for now, but the following should remove the widget:
        document.getElementById(widget.id).parentNode.removeChild(document.getElementById(widget.id));
    }
}

/**
 * Represents a label widget, which displays simple text.
 */
class labelWidget extends Widget(widgetInterface) {
    constructor() {
      super();
    }

    init(title, key){
        this.title = title;
        this.data = "/SmartDashboard/" + key;
    }

    /*data(key){
        this.data = "/SmartDashboard/" + key;
    }*/

    render(id, value){
        this.value = value;
        this.id = 'label.' + id;

        // console.log(`"${this.title}"`);
        var elem = `<div class="label" id="${this.id}"><p class="nt_key">${this.title}</p><br><p class="nt_value">${this.value}</p></div>`;

        return elem;
    }

    update(value){
        var elem = document.getElementById(this.id);

        elem.querySelector(".nt_value").innerHTML = value;
    }
  }

  /* \\For testing purposes:
  
  lw = new labelWidget();
  lw.init("Test", "widgets/test");
  //lw.data("widgets/test");
  
  panel = new widgetPanel();
  panel.init("Right", "widgetsRight");

  panel.add(lw, 1001);

  lw2 = new labelWidget();
  lw2.init("Angle");
  lw2.data("widgets/angle");


  panel.add(lw2, 0);*/

  /* More test code: and it works!
  
  var initialValue = "example value";
  setInterval(() => {
    NetworkTables.putValue("/SmartDashboard/ExampleKey", initialValue);  
    initialValue+=" 2";
  }, 2000);*/
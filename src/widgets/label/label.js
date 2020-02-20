
class Label extends Widget {
    constructor(){
        super();

        console.log('In LabelWidget ', Label.widgets);
    }
}

Widget.widgetTypes['Label'] = Label;

console.log("Widget Types:", Widget.widgetTypes);

// new Label();
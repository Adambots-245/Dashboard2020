
class Gyro extends Widget {
    constructor(){
        super();

        console.log('In GyroWidget ', Gyro.widgets);
    }

    //@override
    bindNTListener(){
        let widgetType = this.name; 
        let jsonData = this.data;

        NetworkTables.addKeyListener(this.widgetData, (key, value) => {
            let imgElement = $(`gyro.img.${this.widgetId}`);
            let templateFn = Widget.widgetTemplates.get(widgetType);

            // let needleElement = 

            $(`#gyro-img-${this.widgetId} #path9631`).css({'transform-box': 'fill-box', 'transform-origin': 'center', 'transform': `rotate(${value})`})

            //$(`#${this.widgetId}`).html(templateFn(jsonData));
        });
    }
}

Widget.widgetTypes['Gyro'] = Gyro;
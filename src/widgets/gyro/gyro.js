
class Gyro extends Widget {
    constructor(){
        super();

        console.log('In GyroWidget ', Gyro.widgets);
    }

    //@override
    bindNTListener(){
        let widgetType = this.name; 
        let jsonData = this.data;
    }
}

Widget.widgetTypes['Gyro'] = Gyro;
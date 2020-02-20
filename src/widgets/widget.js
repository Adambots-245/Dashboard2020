// window.$ = require('jquery');

// var handlebars = require('handlebars');

// class Widget {
    
//     constructor(){
//         // this.widgets = new Map();
//         ////console.log('In Widget Constructor');
//         this.name = this.constructor.name.toLowerCase();

//         this.data = {};

//         //console.log('Name:', this.name);
//         //console.log("Templates:", Widget.widgetTemplates); 
//         //console.log('Is this Widget Type already registered?', Widget.widgetTemplates.has(this.name));
//         // Load only once per class
//         if (!Widget.widgetTemplates.has(this.name))
//             this.loadTemplate();
//     }

//     static widgetTemplates = new Map();
//     static widgetTypes = {};

//     // init(name){
//     //     this.registerTag(name);

//     //     $(name).each((t, i, e) => {
//     //         //console.log($(this));
//     //     });
//     // }

//     loadTemplate(){
//         //console.log('Loading template ...', this.name);
//         let widgetName = this.name;
//         $.ajax({
//             url: `widgets/${widgetName}/${widgetName}.html`,
//             cache: true,
//             async: false,
//             success: function(data) {
//               let source    = data;

//               Widget.widgetTemplates.set(widgetName, handlebars.compile(source));
//               //console.log('Template: ', Widget.widgetTemplates.get(widgetName));
//               //console.log(`has: ${widgetName}`, Widget.widgetTemplates.has(widgetName));
//               //console.log("Templates in loadTemplate:", Widget.widgetTemplates);

//                 //$(target).html(template(jsonData));
//                 // $('#test1').html(templateFn(jsonData));
//             }               
//           });   
//     }

//     process(attributes){
//         let widgetType = this.name; //attributes['type'].value.trim().toLowerCase();
//         this.widgetId = attributes['id'].value;
//         this.widgetData = attributes['data'].value;
//         let jsonData = this.data;

//         console.log(`Processing widget of ${widgetType} and id = ${this.widgetId}`);

//         $.each(attributes, function(i,a){
//             jsonData[a.name] = a.value; // using this.data is tricky here since jQuery overrides this

//             if (a.name === 'data'){
//                 jsonData[a.name] = NetworkTables.getValue(a.value, a.value);
//             }
            
//             console.log(i,jsonData[a.name],jsonData[a.value]);
//         })

//         // console.log("+=>[" + widgetType + "]");
//         // console.log("Templates: ", Widget.widgetTemplates);

//         //get the handlebar template
//         let templateFn = Widget.widgetTemplates.get(widgetType);

//         console.log(templateFn(jsonData));

//         // console.log("template function:", Widget.widgetTemplates.get(widgetType));

//         //process the template and add the substituted values in the template
//         $(`#${this.widgetId}`).html(templateFn(jsonData));

//         this.bindNTListener();
//     }

//     bindNTListener(){
//         let widgetType = this.name; 
//         let jsonData = this.data;

//         NetworkTables.addKeyListener(this.widgetData, (key, value) => {
//             let templateFn = Widget.widgetTemplates.get(widgetType);
//             jsonData['data'] = value;

//             $(`#${this.widgetId}`).html(templateFn(jsonData));
//         });
//     }
// }

// class WidgetLoader{
//     constructor(tagName){
//         this.tagName = tagName;

//         this.loadWidgets();
//         this.bindToWidgets();
//     }

//     static widgets = [];

//     // Look for folders under src/widgets folder and then load the .js file in each
//     loadWidgets(){
//         //console.log("Loading Widgets in WidgetLoader");
//         fs.readdirSync("src/widgets").forEach((v, i, arr) => {
//             //console.log("Widget => ", v);

//             let listing = `src/widgets/${v}`;
//             if (fs.lstatSync(listing).isDirectory()){
//                 //console.log("Loading widget from folder:", v);
//                 let widget = `./widgets/${v}/${v}.js`;
//                 require(widget);
//             }   
//         });
//         //console.log("End Loading Widgets in WidgetLoader");

//         return this; // for chaining
//     }

//     bindToWidgets(){

//         //console.log("In bindToWidgets");


//         $(this.tagName).each(function() {

//             WidgetLoader.loadWidget(this);
//         })
        
//         return this;
//     }

//     static loadWidget(htmlElement){

//         let widgetType = htmlElement.attributes['type'].value.trim();
//         console.log("+=>[" + widgetType + "]");
//         console.log("-=>", Widget.widgetTypes[widgetType]);

//         let widget = new Widget.widgetTypes[widgetType]();
//         //console.log("Creating an instance of type:", widgetType);
//         WidgetLoader.widgets.push(widget);
//         widget.process(htmlElement.attributes);

//     }
// }

// /** Registers a new HTML tag for the widget
//     * @param name The desired name for the new tag
//     * @param parentTag The desired parent tag that this tag should be based on. Defaults to 'div'
//     * @return tag element
//     **/
// function registerTag(name, parentTag){
//     let tag = document.registerElement(name, {
//     prototype: Object.create(HTMLDivElement.prototype),
//     extends: parentTag?parentTag: 'div'
//     });
// }

// const widgetTag = 'dash-widget';
// registerTag(widgetTag);
// new WidgetLoader(widgetTag);

// //require('./widgets/label/label.js');


// var initialValue = 1001;
// var gyroValue = randomIntFromInterval(0, 360);
//   setInterval(() => {
//     initialValue++;
//     NetworkTables.putValue("widgets/test", initialValue);  
//     NetworkTables.putValue("widgets/test2", gyroValue + "deg");  
//     gyroValue += 10;
//     if (gyroValue > 360)
//         gyroValue = 0;
//     // ui.toast({text: initialValue, duration: 3, type: "success"});
//     // lw.update(initialValue++);
//   }, 200);


//   function onElementInserted(containerSelector, elementSelector, callback) {

//     var onMutationsObserved = function(mutations) {
//         mutations.forEach(function(mutation) {
//             if (mutation.addedNodes.length) {
//                 var elements = $(mutation.addedNodes).find(elementSelector);
//                 for (var i = 0, len = elements.length; i < len; i++) {
//                     callback(elements[i]);
//                 }
//             }
//         });
//     };

//     var target = $(containerSelector)[0];
//     var config = { childList: true, subtree: true };
//     var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
//     var observer = new MutationObserver(onMutationsObserved);    
//     observer.observe(target, config);

// }

// // onElementInserted('body', '.myTargetElement', function(element) {
// //     console.log(element);
// // });

// function randomIntFromInterval(min, max) { // min and max included 
//     return Math.floor(Math.random() * (max - min + 1) + min);
//   }
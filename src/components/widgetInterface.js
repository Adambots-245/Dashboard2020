//Custom widgets for displaying network table values in an aesthetically pleasing format


const Widget = require('es6-interface')

/** Interface to implement for a basic widget. */
const widgetInterface = new Set(['init(title, key)','render(id, value)', 'update(value)']);

/** Interface to implement for a widget panel. */
const panelInterface = new Set(['init(title, elemid)', 'add(widget, initialValue)', 'remove(widget)']);


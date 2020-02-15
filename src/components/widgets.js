//Custom widgets for displaying network table values in an aesthetically pleasing format


ui.widgets = {};

/**
 * Creates a new widget with a custom display function.
 * 
 * @param {String} name - The name of the widget
 * @param {String} location - The 
 * @param {function(String, *, *):String} displayFunc - The function to display the widget
 */
function Widget(name, location, displayFunc) {

    /**
     * Displays the widget.
     * 
     * @param {String} key - The NT key
     * @param {*} value - The NT value
     * @param {Object} [options] - Additional optional options specific to the widget
     */
    this.display = (key, value, options) => {$("#" + location)[0].innerHTML += displayFunc(key, value, options);};
    ui.widgets[name] = this;

}
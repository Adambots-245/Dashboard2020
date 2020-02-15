//Custom widgets for displaying network table values in an aesthetically pleasing format


ui.widgets = {};
var id = 0;

/**
 * Creates a new widget with a custom display function.
 * 
 * @param {String} name - The name of the widget
 * @param {function(String, *, *):HTMLElement} displayFunc - The function to display the widget
 */
function WidgetInterface(name, displayFunc) {

    /**
     * Displays the widget.
     * 
     * @param {String} key - The NT key
     * @param {*} value - The NT value
     * @param {Object} [options] - Additional optional options specific to the widget
     */
    this.display = (key, value, options) => {
        var elem = $(displayFunc(key, value, options));
        var wrapper = $(document.createElement("div")).addClass("nt_container").attr("id", "wrapper" + id);
        elem.wrap(wrapper);
        $("#wrapper" + id).html(`<p class='nt_key'>${key}</p>` + $("#wrapper" + id).html());
    }

    this.add = () => {
        ui.widgets[name] = this;
    }

}



ui.Widget = WidgetInterface;
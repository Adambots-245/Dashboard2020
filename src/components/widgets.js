//Custom widgets for displaying network table values in an aesthetically pleasing format


//------------------Utilities---------------------\\

/**
 * A non-widget utility for wrapping widgets in the default container box.
 * 
 * @param {*} elem - The widget's HTML Element, to be wrapped by container box
 */
function wrapElement(elem) {
    var doublediv = "<div class='nt_outer'><div class='nt_inner'></div></div>";

    $(elem).wrap(doublediv);
}

/**
 * A non-widget utility for inserting key/value pairs into widget elements.
 * 
 * @param {*} key - The key (title) of the network table subtable
 * @param {*} val - The value (content) of the network table subtable
 */
function innerElement(key, val) {
    return `<p class="nt_key">${key}</p><br><p class="nt_val">${val}</p>`;
}

/**
 * Finds and returns a widget function
 * 
 * @param {String} widget - The name of the widget (or none)
 * @param {String} [type] - The datatype of the NT value
 */
function findWidget(widget, type) {

    switch (widget) {

        case "none":
            type = type || "string";

            switch (type) {

                case "string":
                    return defaultString;
                case "boolean":
                    return defaultBoolean;
                default:
                    //No valid datatype specified, insert as String
                    return defaultString;

            }
            //break;
        case "insertotherwidgetshere":

            break;
        default:
            //No valid widget specified
            return defaultString;

    }

}


//------------------------------Widgets----------------------------\\

/**
 * The default widget for outputting a String.
 * 
 * @param {*} elem - The widget's HTML element
 * @param {String} key - The key of the NT subtable
 * @param {String} val - The value of the NT subtable
 */
function defaultString(elem, key, val) {

    $(elem).addClass("string");
    $(elem).html(innerElement(key, val));
    wrapElement(elem);

}

/**
 * The default widget for outputting a Boolean.
 * 
 * @param {*} elem - The widget's HTML element
 * @param {String} key - The key of the NT subtable
 * @param {Boolean} val - The value of the NT subtable
 */
function defaultBoolean(elem, key, val) {

    $(elem).addClass("toggle");
    $(elem).attr("val", val);
    $(elem).html(innerElement(key, val));
    wrapElement(elem);

}





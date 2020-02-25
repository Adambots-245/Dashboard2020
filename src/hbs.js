const fs = require("fs");
var uidIteration = 0;


module.exports = (config) => {
    require("./universal-handlebars")(config);
    const Handlebars = require("handlebars");

    Handlebars.registerHelper("NTBind", (networkTableKey, funcName, parentID) => {

        let uid = "widget_" + uidIteration; uidIteration++;
        let ntKey = Handlebars.escapeExpression(networkTableKey);

        let retStr = "";
        //console.log("Func:", funcName, typeof funcName);
        if (typeof funcName != "string") {
            retStr = `
            <div id="${uid}"></div>
            <script>
                var $ = require("jquery");

                NetworkTables.addKeyListener("${ntKey}", (key, value) => {
                    $("#${uid}").html(value);
                });
            </script>
        `;
        }
        else{
            let fName = Handlebars.escapeExpression(funcName);
            let idParam = ``;

            if (typeof parentID === "string") idParam = `"${Handlebars.escapeExpression(parentID)}", `;

            retStr = `
            <span>    
            <script>
            
                NetworkTables.addKeyListener("${ntKey}", (key, value) => {
                    if ("uiExists" in window) ${fName}(${idParam}value);
                });
                </script>
                </span>
                `;
        }

        return new Handlebars.SafeString(retStr);

    });

    Handlebars.registerHelper("EachBind", (ntArrayKey, funcName) => {
        let retStr = "";

        if (typeof funcName == "string") {
            ntArrayKey.forEach((item) => {
                retStr += `
                <span>
                <script>
                    ${funcName}("${item}");
                </script>
                </span>
                `;
            });
        }

        return new Handlebars.SafeString(retStr);
    });

    Handlebars.registerHelper("Include", (widgetName) => {
        let name = Handlebars.escapeExpression(widgetName);
        let path = `${__dirname}/widgets/${name}/${name}.hbs`;
        // $.ajax({
        //     url: `widgets/${name}/${name}.html`,
        //     cache: true,
        //     async: false,
        //     success: function(data) {
        //       let source    = data;
        //         return new Handlebars.SafeString(source);
        //     }               
        //   });

        let hbs = fs.readFileSync(path).toString();

        let compiledString = Handlebars.compile(hbs);
        //console.log(Handlebars.helpers);

        let retStr = new Handlebars.SafeString(compiledString(config));

        // console.log("Ret:", retStr);
        return retStr;
    });
};
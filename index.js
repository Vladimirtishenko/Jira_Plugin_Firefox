let buttons = require('sdk/ui/button/action');
let tabs = require("sdk/tabs");
let data = require("sdk/self").data;
let pageMod = require("sdk/page-mod");
let Request = require("sdk/request").Request;
let tag = "p";

// Be a good consumer and check for rate limiting before doing more.
/**/


var button = buttons.ActionButton({
    id: "jirapluginfirefox",
    label: "Jira Templates",
    icon: {
        "16": data.url("img/add16.png"),
        "32": data.url("img/add32.png"),
        "64": data.url("img/add64.jpg")
    },
    onClick: function() {}
});


pageMod.PageMod({
    include: "*",
    contentScriptFile: data.url("lib/app.js"),
    onAttach: function(worker) {

        worker.port.on("makeRequest", function(url) {
            Request({
                url: url,
                onComplete: function(response) {
                    worker.port.emit("makeResponse", response.text);
                }
            }).get();
        });
    }
});

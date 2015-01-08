/*
 * Copyright 2014-2015 Neil Ellis
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

"use strict";

var fs = require('fs');
var system = require('system');
var pageFactory = require('webpage');
//var debugFile = "/tmp/phantom-debug-" + new Date().getTime() + ".log";
//fs.write(debugFile, new Date(), "a");
var lastRequest = new Date();
var oneHour = 3600 * 1000;
var debugOn = true;
var graceTime = 2;

setInterval(function () {
    if (new Date().getTime() - lastRequest.getTime() > oneHour) {
        debug("ERROR: Slimer/phantomjs timed out due to inactivity - probably orphaned.");
        phantom.exit(1);
    }
}, 10 * 1000);


function debug(s) {
    if (debugOn) {
        console.log(s);
//        fs.write(debugFile, s + "\n", "a");
    }
}

function closeSafely(o) {
    try {
        o.close();
    } catch (e) {
        console.log(e)
    }
}

phantom.onError = function (msg, trace) {
    var msgStack = ['SLIMER/PHANTOM ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function (t) {
            msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function + ')' : ''));
        });
    }
    console.error(msgStack.join('\n'));
};


function addDebug(page) {
    if (!debugOn) {
        return;
    }

    page.onResourceRequested = function (request) {
        console.log('= onResourceRequested()');
        console.log('  request: ' + JSON.stringify(request, undefined, 4));
    };

    page.onResourceReceived = function (response) {
        console.log('= onResourceReceived()');
        console.log('  id: ' + response.id + ', stage: "' + response.stage + '", response: ' + JSON.stringify(response));
    };

    page.onLoadStarted = function () {
        console.log('= onLoadStarted()');
        var currentUrl = page.evaluate(function () {
            return window.location.href;
        });
        console.log('  leaving url: ' + currentUrl);
    };

    page.onLoadFinished = function (status) {
        console.log('= onLoadFinished()');
        console.log('  status: ' + status);
    };

    page.onNavigationRequested = function (url, type, willNavigate, main) {
        console.log('= onNavigationRequested');
        console.log('  destination_url: ' + url);
        console.log('  type (cause): ' + type);
        console.log('  will navigate: ' + willNavigate);
        console.log('  from page\'s main frame: ' + main);
    };

    page.onResourceError = function (resourceError) {
        console.log('= onResourceError()');
        console.log('  - unable to load url: "' + resourceError.url + '"');
        console.log('  - error code: ' + resourceError.errorCode + ', description: ' + resourceError.errorString);
    };

    page.onError = function (msg, trace) {
        console.log('= onError()');
        var msgStack = ['  ERROR: ' + msg];
        if (trace) {
            msgStack.push('  TRACE:');
            trace.forEach(function (t) {
                msgStack.push('    -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
            });
        }
        console.log(msgStack.join('\n'));
    };
}


var done = false;
var start = new Date().getTime();
//    var delay = req.url.split("delay=")[1].split("&")[0];
var lang = phantom.args[4];
if (!lang) {
    lang = "en-gb";
}
var delay = phantom.args[3];
if (delay * 0 != 0) {
    console.log("Invalid delay supplied.");
    phantom.exit(-2)
}

if (delay < 0) {
    delay = 0;
}
var output = phantom.args[1];
var key = phantom.args[2];
var viewPortWidth = phantom.args[7];
var viewPortHeight = phantom.args[8];
var width = phantom.args[5];
var height = phantom.args[6];

var address = phantom.args[0];
var page = pageFactory.create();
addDebug(page);

page.settings.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:25.0) Gecko/20100101 Firefox/25.0';
page.customHeaders = {
    "Accept-Language": lang,
    "Referer": address + ";userApiKey=" + key + ",message='Please report abuse to support@snapito.com'"
};
page.viewportSize = { width: viewPortWidth, height: viewPortHeight};


var requestTimeout = setTimeout(function () {
    if (!done) {
        done = true;
        closeSafely(page);
        debug("ERROR: Slimer/phantomjs timed out request for " + address);
        phantom.exit(1)
    }
}, (graceTime * 2 + delay) * 1000);

var lastActivity = new Date();


page.open(address, function (status) {
    try {
        page.evaluate(function (w, h) {
            document.body.style.width = w > 0 ? w + "px" : "auto";
            document.body.style.height = h > 0 ? h + "px" : "auto";
        }, viewPortWidth, viewPortHeight);
    } catch (e) {
        console.log(e)
    }

    if (viewPortHeight > 0 && viewPortWidth > 0) {
        try {
            page.clipRect = {top: 0, left: 0, width: viewPortWidth, height: viewPortHeight};
        } catch (e) {
            console.log(e)
        }
    }

    if (status != 'success') {
        done = true;
        closeSafely(page);
        debug('ERROR: Unable to load the address ' + address);
        clearTimeout(requestTimeout);
        phantom.exit();
    } else {
        try {

            var renderStart = new Date();

            page.onResourceRequested = function (request) {
                lastActivity = new Date();
            };

            page.onResourceReceived = function (response) {
                lastActivity = new Date();
            };

            debug("Rendering " + address);
            debug("Delay used: " + delay + " ");
            var renderWhenReady = function () {
                try {
                    var activityTimeDiff = new Date().getTime() - lastActivity.getTime();
                    var renderDuration = new Date().getTime() - renderStart.getTime();
                    if ((activityTimeDiff < 300 || renderDuration < 1000 * delay) && renderDuration < 1000 * (delay + graceTime)) {
                        debug("ATD: " + activityTimeDiff + " RD: " + renderDuration);
                        setTimeout(renderWhenReady, 100);
                        return;
                    }
                    page.render(output);
                    done = true;
                    closeSafely(page);
                    debug("Rendered okay");
                    phantom.exit(0);
                } catch (e) {
                    done = true;
                    closeSafely(page);
                    debug("ERROR: " + e);
                    debug(e);
                    phantom.exit(1);
                } finally {
                    clearTimeout(requestTimeout);
                }
            };
            setTimeout(renderWhenReady, 0);
        } catch (e) {
            done = true;
            closeSafely(page);
            debug("ERROR: " + e);
            phantom.exit(1);
        }

    }
});


//debug("Server starting on port " + phantom.args[0]);


// DO NOT REMOVE!!!
//                setTimeout(function () {
//                    try {
//                        var f = fs.open(output, "rb");
//                        debug("Reading from image file for " + address);
//                        resp.setEncoding("binary");
//                        resp.setHeader("Content-Type", "image/png");
//                        resp.write(f.read());
//                        resp.closeGracefully();
//                        f.close();
//                        page.setContent("", "about:");
//                        closeSafely(page);
//                    } catch (e) {
//                        debug(e);
//                        resp.statusCode = 500;
//                        resp.write("ERROR: " + e);
//                        closeSafely(resp);
//                    } finally {
//                        done = true;
//                        fs.remove(output);
//                        clearTimeout(requestTimeout);
//                    }
//                    debug("Rendered in  " + (new Date().getTime() - renderStart));
//                    debug("Took " + (new Date().getTime() - start));
//                }, 1000);

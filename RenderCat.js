///<reference path="./typings/node/node.d.ts"/>
///<reference path="./typings/express/express.d.ts"/>
var ph = require('phantom');
var childProcess = require('child_process');
var spawn = childProcess.spawn;

console.log("Rendercat");

var RenderRequest = (function () {
    function RenderRequest(url, delay) {
        this.engine = "phantom";
        this.url = null;
        this.key = "free";
        this.delay = 0;
        this.lang = "en_GB";
        this.width = 1280;
        this.height = 1024;
        this.viewportWidth = 1280;
        this.viewportHeight = 1024;
        this.fileType = "png";
        this.filter = "box";
        this.unsharp = 0;
        this.cropx = 0;
        this.cropy = 0;
        this.cropw = 1280;
        this.croph = 1024;
        this.url = url;
        this.file = "/app/public/_rendered/" + url.replace(/\W/g, '_') + ".png";
        this.delay = delay;
    }
    RenderRequest.prototype.commandLine = function () {
        return [this.engine, this.url, this.file, this.key, this.delay, this.lang, this.width, this.height, this.viewportWidth, this.viewportHeight, this.fileType, this.filter, this.unsharp, this.cropx, this.cropy, this.cropw, this.croph];
    };

    RenderRequest.prototype.shellArg = function () {
        return this.engine + " '" + this.url + "' " + this.file + " '" + this.key + "' " + this.delay + " " + this.lang + " " + this.width + " " + this.height + " " + this.viewportWidth + " " + this.viewportHeight + " " + this.fileType + " " + this.filter + " " + this.unsharp + " " + this.cropx + " " + this.cropy + " " + this.cropw + " " + this.croph;
    };
    return RenderRequest;
})();
exports.RenderRequest = RenderRequest;

var RenderCat = (function () {
    function RenderCat(req, res) {
        this.req = null;
        this.res = null;
        this.req = req;
        this.res = res;
    }
    RenderCat.prototype.inBrowser = function (fn) {
        ph.create(fn);
    };

    RenderCat.prototype.renderUsing = function (url, delay, callback) {
        this.render(new RenderRequest(url, delay), callback);
    };

    RenderCat.prototype.render = function (renderReq, callback) {
        try  {
            var child = spawn('/bin/bash', ["-c", "/usr/local/bin/render " + renderReq.shellArg()]);
        } catch (e) {
            console.log(e);
        }
        var resp = "";
        child.stdout.on('data', function (buffer) {
            resp += buffer.toString();
        });
        child.stdout.on('end', function () {
            console.log(resp);
            callback(resp);
        });
    };
    return RenderCat;
})();
exports.RenderCat = RenderCat;
//# sourceMappingURL=RenderCat.js.map

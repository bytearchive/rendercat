///<reference path="./typings/node/node.d.ts"/>
///<reference path="./typings/express/express.d.ts"/>
var ph = require('phantom');
var childProcess = require('child_process');
var spawn = childProcess.spawn;
var execFile = childProcess.execFile;
var crypto = require('crypto');
var RenderRequest = (function () {
    function RenderRequest(url, delay, lang, width, height, viewPortWidth, viewPortHeight, fileType, device, cache) {
        if (cache === void 0) {
            cache = 1;
        }
        this.hash = null;
        this.engine = "slimer";
        this.url = null;
        this.key = "free";
        this.delay = 0;
        this.lang = "en_GB";
        this.width = 1280;
        this.height = 1024;
        this.viewportWidth = 1280;
        this.viewportHeight = 1024;
        this.fileType = "png";
        this.filter = "lanczos";
        this.unsharp = 0;
        this.cropx = 0;
        this.cropy = 0;
        this.cropw = 1280;
        this.croph = 1024;
        this.device = "desktop";
        this.cacheTime = 1;
        this.url = url;
        this.delay = delay;
        this.lang = lang;
        this.width = width;
        this.height = height;
        this.viewportWidth = viewPortWidth;
        this.viewportHeight = viewPortHeight;
        this.cropw = width;
        this.croph = height;
        this.fileType = fileType;
        this.device = device;
        var shasum = crypto.createHash('sha1');
        this.cacheTime = Math.floor(new Date().getTime() / cache);
        shasum.update(this.engine + " '" + encodeURI(this.url) + "' '" + this.key + "' " + this.delay + " " + this.lang + " " + this.width + " " + this.height + " " + this.viewportWidth + " " + this.viewportHeight + " " + this.fileType + " " + this.filter + " " + this.unsharp + " " + this.cropx + " " + this.cropy + " " + this.cropw + " " + this.croph + " " + this.cacheTime);
        this.hash = shasum.digest('hex');
        this.file = "/app/public/_rendered/" + url.replace(/\W/g, '_') + "_" + this.hash;
    }
    RenderRequest.prototype.commandLine = function () {
        return [this.engine, this.url, this.file, this.key, this.delay, this.lang, this.width, this.height, this.viewportWidth, this.viewportHeight, this.fileType, this.filter, this.unsharp, this.cropx, this.cropy, this.cropw, this.croph];
    };
    RenderRequest.prototype.shellArg = function () {
        return this.engine + " '" + encodeURI(this.url) + "' " + this.file + " '" + this.key + "' " + this.delay + " " + this.lang + " " + this.width + " " + this.height + " " + this.viewportWidth + " " + this.viewportHeight + " " + this.fileType + " " + this.filter + " " + this.unsharp + " " + this.cropx + " " + this.cropy + " " + this.cropw + " " + this.croph;
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
    RenderCat.prototype.renderUsing = function (url, delay, lang, width, height, viewPortWidth, viewPortHeight, fileType, device, callback) {
        this.render(new RenderRequest(url, delay, lang, width, height, viewPortWidth, viewPortHeight, fileType, device), callback);
    };
    RenderCat.prototype.render = function (renderReq, callback) {
        try {
            console.log("Child process pre-spawn");
            var child = execFile("/usr/local/bin/render", renderReq.commandLine(), {
                detached: true,
                maxBuffer: 1024 * 500,
                stdio: ['ignore', 1, 2]
            }, function (error, buf1, buf2) {
                console.log("Callback " + error);
            });
            console.log("Child process post-spawn " + child);
        }
        catch (e) {
            console.log(e);
        }
        var resp = "";
        child.stdout.on('data', function (buffer) {
            console.log("data");
            resp += buffer.toString();
        });
        child.stdout.on('end', function () {
            console.log("end");
            console.log(resp);
            callback(resp);
        });
        child.stderr.on('data', function (buffer) {
            console.log(buffer);
        });
        child.stderr.on('end', function () {
        });
    };
    return RenderCat;
})();
exports.RenderCat = RenderCat;
//# sourceMappingURL=RenderCat.js.map
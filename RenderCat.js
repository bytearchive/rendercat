///<reference path="./typings/node/node.d.ts"/>
///<reference path="./typings/express/express.d.ts"/>
var ph = require('phantom');

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
    return RenderCat;
})();
exports.RenderCat = RenderCat;
//# sourceMappingURL=RenderCat.js.map

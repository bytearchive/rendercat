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

///<reference path="./typings/node/node.d.ts"/>
///<reference path="./typings/express/express.d.ts"/>
var ph = require('phantom');

console.log("Rendercat");

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

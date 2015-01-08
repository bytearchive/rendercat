///<reference path="./typings/node/node.d.ts"/>
///<reference path="./typings/express/express.d.ts"/>

var ph = require('phantom');
import childProcess = require('child_process');
var spawn = childProcess.spawn;
import express= require('express');
var crypto = require('crypto');

export class RenderRequest {

    constructor(url:string, delay:number, lang:string, width:number, height:number, viewPortWidth:number,
                viewPortHeight:number, fileType:string, device:string, cache:number=1) {
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
        shasum.update(this.engine + " '" + encodeURI(this.url) + "' '" + this.key + "' " + this.delay + " " + this.lang + " " + this.width + " " + this.height + " " + this.viewportWidth + " " + this.viewportHeight + " " + this.fileType + " " + this.filter + " " + this.unsharp + " " + this.cropx + " " + this.cropy + " " + this.cropw + " " + this.croph+" "+ this.cacheTime);
        this.hash = shasum.digest('hex');
        this.file = "/app/public/_rendered/" + url.replace(/\W/g, '_') + "_" + this.hash;
    }

    public hash:string = null;
    public engine:string = "slimer";
    public url:string = null;
    public file:string;
    public key:string = "free";
    public delay:number = 0;
    public lang:string = "en_GB";
    public width:number = 1280;
    public height:number = 1024;
    public viewportWidth:number = 1280;
    public viewportHeight:number = 1024;
    public fileType:string = "png";
    public filter:string = "lanczos";
    public unsharp:number = 0;
    public cropx:number = 0;
    public cropy:number = 0;
    public cropw:number = 1280;
    public croph:number = 1024;
    public device:string = "desktop";
    public cacheTime:number=1;

    commandLine():any[] {
        return [this.engine, this.url, this.file, this.key, this.delay, this.lang, this.width, this.height, this.viewportWidth, this.viewportHeight, this.fileType, this.filter, this.unsharp, this.cropx, this.cropy, this.cropw, this.croph]
    }

    shellArg():string {
        return this.engine + " '" + encodeURI(this.url) + "' " + this.file + " '" + this.key + "' " + this.delay + " " + this.lang + " " + this.width + " " + this.height + " " + this.viewportWidth + " " + this.viewportHeight + " " + this.fileType + " " + this.filter + " " + this.unsharp + " " + this.cropx + " " + this.cropy + " " + this.cropw + " " + this.croph;
    }

}

export class RenderCat {
    public req:express.Request = null;
    public res:express.Response = null;

    constructor(req:express.Request, res:express.Response) {
        this.req = req;
        this.res = res;
    }

    inBrowser(fn:(phantom:any)=>void) {
        ph.create(fn);
    }

    renderUsing(url:string, delay:number, lang:string, width:number, height:number, viewPortWidth:number,
                viewPortHeight:number, fileType:string, device:string, callback:(string)=>void) {
        this.render(new RenderRequest(url, delay, lang, width, height, viewPortWidth, viewPortHeight, fileType, device),
                    callback);
    }

    render(renderReq:RenderRequest, callback:(string)=>void) {
        try {
            var child:childProcess.ChildProcess = spawn('/bin/bash',
                                                        ["-c", "/usr/local/bin/render " + renderReq.shellArg()]);
        } catch (e) {
            console.log(e);
        }
        var resp:string = "";
        child.stdout.on('data', function (buffer) {
            resp += buffer.toString()
        });
        child.stdout.on('end', function () {
            console.log(resp);
            callback(resp);
        });

    }

}

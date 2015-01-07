///<reference path="./typings/node/node.d.ts"/>
///<reference path="./typings/express/express.d.ts"/>

var ph = require('phantom');
import childProcess = require('child_process');
var spawn = childProcess.spawn;
import express= require('express');

console.log("Rendercat");

export class RenderRequest {

    constructor(url:string, delay:number) {
        this.url = url;
        this.file = "/app/public/_rendered/" + url.replace(/\W/g, '_') + ".png";
        this.delay = delay;
    }

    public engine:string = "phantom";
    public url:string = null;
    public file:string; //address.replace(/\W/g, '_') + ".png"
    public key:string = "free";
    public delay:number = 0;
    public lang:string = "en_GB";
    public width:number = 1280;
    public height:number = 1024;
    public viewportWidth:number = 1280;
    public viewportHeight:number = 1024;
    public fileType:string = "png";
    public filter:string = "box";
    public unsharp:number = 0;
    public cropx:number = 0;
    public cropy:number = 0;
    public cropw:number = 1280;
    public croph:number = 1024;

    commandLine():any[] {
        return [this.engine, this.url, this.file, this.key, this.delay, this.lang, this.width,this.height, this.viewportWidth, this.viewportHeight, this.fileType, this.filter, this.unsharp, this.cropx, this.cropy, this.cropw, this.croph]
    }

    shellArg():string {
        return this.engine + " '" + this.url + "' " + this.file + " '" + this.key + "' " + this.delay + " " + this.lang + " " + this.width +" " + this.height + " " + this.viewportWidth + " " + this.viewportHeight + " " + this.fileType + " " + this.filter + " " + this.unsharp + " " + this.cropx + " " + this.cropy + " " + this.cropw + " " + this.croph;
    }

    /**
     * export URL="$(python -c "import urllib, sys; print urllib.unquote(sys.argv[1])" $1)"
     export FILE="/img/$2"
     export KEY="$3"
     export DELAY="$4"
     export LANG="$5"
     export WIDTH="$6"
     export HEIGHT="$7"
     export VP_WIDTH="$8"
     export VP_HEIGHT="$9"
     export FILE_TYPE="${10}"
     export FILTER="${11}"
     export UNSHARP="${12}"
     export CROPX="${13}"
     export CROPY="${14}"
     export CROPW="${15}"
     export CROPH="${16}"
     */

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


    renderUsing(url:string,delay:number,callback:(string)=>void) {
        this.render(new RenderRequest(url,delay),callback);
    }

    render(renderReq:RenderRequest, callback:(string)=>void) {
        try {
            var child:childProcess.ChildProcess = spawn('/bin/bash', ["-c", "/usr/local/bin/render "+renderReq.shellArg()]);
        } catch(e) {
            console.log(e);
        }
        var resp:string ="";
        child.stdout.on('data', function (buffer) { resp += buffer.toString() });
        child.stdout.on('end', function() { console.log(resp);callback(resp); });

    }

}

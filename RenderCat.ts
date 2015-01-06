///<reference path="./typings/node/node.d.ts"/>
///<reference path="./typings/express/express.d.ts"/>

var ph = require('phantom');
import express= require('express');

console.log("Rendercat");

export class RenderCat {
    public req:express.Request= null;
    public res:express.Response= null;

    constructor(req:express.Request, res:express.Response) {
        this.req= req;
        this.res= res;
    }

    inBrowser(fn:(phantom:any)=>void) {
        ph.create(fn);
    }
}

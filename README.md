A DIY rendering engine for all your rendering needs based on NodeJS, Express, Phatom-Node, PhantomJS and SlimerJS.

For a fully functioning example please visit the project http://github.com/neilellis/rendercat-snapshot or use the demo online at http://rendercat-snapshot-1.neilellis.cont.tutum.io/

To use rendercat create a new project with a Dockerfile like this:

```Dockerfile
FROM neilellis/rendercat
```
Make sure you have directories called `public` and `modules` these will be added automatically (you don't need to put instructions in your Dockerfile). The `public` directory contains static artifacts that will be served up by rendercat's Nginx instance. The `modules` directory should contain CommonJS style modules (see http://github.com/neilellis/rendercat-snapshot for an example of layout).

Rendercat makes available the functions in the modules using the following URL format
```
  /api/<api-version>/<module>/<function>
```

The current api version is 0.1. 

The recommended manner for adding NodeJS modules is by adding `npm install x.y.z` instructions in the Dockerfile.

Released under ASL 2.0 (c) 2014-2015 Neil Ellis

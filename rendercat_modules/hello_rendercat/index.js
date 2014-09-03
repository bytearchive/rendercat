exports.hello = function (rc) {
    rc.res.write('Hello World');
    rc.res.end();
};

exports.helloPhantom = function (rc) {
    rc.inBrowser(function (ph) {
        ph.createPage(function (page) {
            page.open("http://bbc.com", function (status) {
                console.log("opened bbc? ", status);
                page.evaluate(function () {
                    return document.title;
                }, function (result) {
                    rc.res.write(result);
                    rc.res.end();
                    ph.exit();
                });
            });
        });
    });
};


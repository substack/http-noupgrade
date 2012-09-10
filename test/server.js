var http = require('../');
var test = require('tap').test;

test(function (t) {
    t.plan(2);
    
    var server = http.createServer(function (req, res) {
        if (req.headers.upgrade) {
            req.on('data', function (buf) {
                res.write(String(buf).toUpperCase());
            });
        }
        else res.end('beep boop');
    });
    server.listen();
    var port = server.address().port;
    
    server.on('listening', function () {
        var opts = {
            host : 'localhost',
            port : port,
            path : '/',
            headers : { upgrade : true }
        };
        var r = http.request(opts, function (res) {
            t.same(res.headers, {});
            
            res.on('data', function (buf) {
                t.equal(String(buf), 'BEEP\n');
                r.end();
            });
        });
        r.write('beep\n');
    });
    
    t.on('end', function () {
        server.close();
    });
});

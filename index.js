var http = require('http');

Object.keys(http).forEach(function (key) {
    exports[key] = http[key];
});

exports.createServer = function (cb) {
    var server = http.createServer(cb);
    
    server.on('upgrade', function (req, socket, head) {
        var res = new http.ServerResponse(req);
        res.assignSocket(socket);
        res.on('finish', function () {
            res.detachSocket(socket);
            socket.destroySoon();
        });
        res.useChunkedEncodingByDefault = false;
        
        socket.on('data', function (buf) { req.emit('data', buf) });
        socket.on('end', function () { req.emit('end') });
        
        server.emit('request', req, res);
        
        if (head.length) req.emit('data', head);
    });
    
    return server;
};

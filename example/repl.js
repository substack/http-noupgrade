var http = require('../');
var repl = require('repl');

var server = http.createServer(function (req, res) {
    if (req.headers.upgrade) {
        res.write('# repl party server\n');
        repl.start({ input : req, output : res });
    }
    else res.end('beep boop');
});
server.listen(8000);

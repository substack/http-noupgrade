# http-noupgrade

merge `'upgrade'` requests back into the `'request'` listener

# example

``` js
var http = require('http-noupgrade');

var server = http.createServer(function (req, res) {
    if (req.headers.upgrade) {
        repl.start({ input : req, output : res });
    }
    else res.end('beep boop');
});
server.listen(8000);
```

# hypothesis

Emitting an `'upgrade'` event with `(request, socket, head)` parameters makes
using and writing websocket server handlers much more complicated than it needs
to be. Because the necessary events are spread out across both `'upgrade'` and
`'request'`, websocket libraries tend to have an `install()` mechanism for
adding the listeners themselves. This is unfortunate because it obscures the
correspondence between the original http request and the resulting duplex
stream. Instead of just passing a `(req,res)` explicitly to a handler after
performing session checks, the websocket or fallback abstraction takes control
of the http server by punching methods, events, and otherwise being hacky and
brittle.

Since http request and response objects can already be paired to make a full
duplex connection, have well-understood and expected semantics, and more
adequately describe the actual http protocol in the case of an upgrade, we
should just let the `'request'` listener handle `'upgrade'` events instead of
using a separate event.

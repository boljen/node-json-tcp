# Javascript Protocol Framework Implementation

Setting up the javascript-protocol-framework session with the json-tcp transport
is very straigth forward. Simply get a socket and a session, and then call the
exported 'protocol' function in this package:

    var init = require('json-tcp').protocol;
    init(socket, session);

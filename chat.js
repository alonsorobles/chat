var net = require('net');

var chatServer = net.createServer(),
    clientList = [];

function broadcast(data, client) {
    var cleanup = [];
    for (var i = 0; i < clientList.length; i += 1) {
        if (clientList[i] !== client) {
            if (clientList[i].writeable) {
                clientList[i].write(client.name + ' says ' + data);
            } else {
                cleanup.push(clientList[i]);
                clientList[i].destroy();
            }
        }
    }

    for (i = 0; i < cleanup.length; i += 1) {
        clientList.splice(clientList.indexOf(cleanup[i]), 1);
    }
}

chatServer.on('connection', function(client) {
    client.name = client.remoteAddress + ':' + client.remotePort;
    client.write('Hi ' + client.name + '!\n');

    clientList.push(client);

    client.on('data', function(data){
        broadcast(data, client);
    });

    client.on('end', function() {
        clientList.splice(clientList.indexOf(client), 1);
    });
});

chatServer.listen(9000);
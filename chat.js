var net = require('net');

var chatServer = net.createServer(),
    clientList = [];

function broadcast(data, client) {
    for (var i = 0; i < clientList.length; i += 1) {
        if (clientList[i] !== client) {
            clientList[i].write(client.name + ' says ' + data);
        }
    }
}

chatServer.on('connection', function(client) {
    client.name = client.remoteAddress + ':' + client.remotePort;
    client.write('Hi ' + client.name + '!\n');

    clientList.push(client);

    client.on('data', function(data){
        broadcast(data, client);
    });
});

chatServer.listen(9000);
var http = require('http'),
	url = require('url'),
	utils = require('./utils.js'),
	dbLayer = require('./database.js'),
	portNumber = process.env.PORT || 8080;

dbLayer.initDB();

http.createServer(function(request, response) {
	var path = url.parse(request.url).pathname;

	utils.log('path: ', path);
	switch (path) {
		case '/adduser':
			addUser(request, response);
			break;

		case '/getuserslist':
			getUsersList(request, response);
			break;

		case '/updateuser':
			updateUser(request, response);
			break;

		case '/deleteuser':
			deleteUser(request, response);
			break;

		case '/deleteallusers':
			deleteAllUsers(request, response);
			break;

		default:
			utils.log('no route provided');
			break;
	}
}).listen(portNumber);

function addUser(request, response) {
	var fullBody = '';

	request.on('data', function(chunk) {
		fullBody += chunk.toString();
	});

	request.on('end', function() {
		fullBody = JSON.parse(fullBody);

		dbLayer.insertRecords(fullBody, function(resp) {
			response.writeHead(200, utils.headers());
			response.end(JSON.stringify({
				resp: resp
			}));
		});
	});
}

function getUsersList(request, response) {
	dbLayer.listRecords('id_member', 'DESC', 100, function(resp) {
		response.writeHead(200, utils.headers());
		response.end(JSON.stringify(resp));
	});
}


function updateUser(request, response) {
	var fullBody = '';

	request.on('data', function(chunk) {
		fullBody += chunk.toString();
	});

	request.on('end', function() {
		fullBody = JSON.parse(fullBody);

		dbLayer.updateRecord('id_member', fullBody.userId, fullBody.userData, function(resp) {
			utils.log('user update resp: ', resp);
			response.writeHead(200, utils.headers());
			response.end(JSON.stringify({
				resp: resp
			}));
		});
	});
}

function deleteUser(request, response) {
	var fullBody = '';

	request.on('data', function(chunk) {
		fullBody += chunk.toString();
	});

	request.on('end', function() {
		fullBody = JSON.parse(fullBody);

		dbLayer.deleteRecord('id_member', fullBody.userId, function(resp) {
			utils.log('user delete resp: ', resp);
			response.writeHead(200, utils.headers());
			response.end(JSON.stringify({
				resp: resp
			}));
		});
	});
}

function deleteAllUsers(request, response) {
	var fullBody = '';

	request.on('data', function(chunk) {
		fullBody += chunk.toString();
	});

	request.on('end', function() {
		fullBody = JSON.parse(fullBody);

		console.log(fullBody);
		dbLayer.deleteMutipleRecords('id_member', fullBody.userIds, function(resp) {
			utils.log('user delete resp: ', resp);
			response.writeHead(200, utils.headers());
			response.end(JSON.stringify({
				resp: resp
			}));
		});
	});
}

function disconnectClient(socket) {
	for (var name in clients) {
		if (clients[name].socket === socket.id) {
			delete clients[name];
			break;
		}
	}
}

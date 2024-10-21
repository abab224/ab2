const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8083 });

const users = {};

wss.on('connection', ws => {
    let username = '';
    let password = '';

    ws.on('message', message => {
        const data = JSON.parse(message);

        if (data.type === 'login') {
            username = data.username;
            password = data.password;

            if (!users[username]) {
                users[username] = { password, ws };
                ws.send(JSON.stringify({ type: 'login', success: true }));
            } else if (users[username].password === password) {
                ws.send(JSON.stringify({ type: 'login', success: true }));
            } else {
                ws.send(JSON.stringify({ type: 'login', success: false }));
            }
        } else if (data.type === 'message') {
            for (const user in users) {
                if (users[user].ws !== ws && users[user].password === password) {
                    users[user].ws.send(JSON.stringify({ type: 'message', username, message: data.message }));
                }
            }
        }
    });

    ws.on('close', () => {
        delete users[username];
    });
});

console.log('WebSocket server is running on ws://localhost:8083');

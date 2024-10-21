document.getElementById('loginBtn').addEventListener('click', function() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // 簡単なログインチェック（デモ用）
  if (username && password) {
    document.getElementById('chat').style.display = 'block';
  }

  const ws = new WebSocket('ws://localhost:8080');

  ws.onopen = function() {
    console.log('Connected to the server');
  };

  ws.onmessage = function(event) {
    const messagesDiv = document.getElementById('messages');
    const data = JSON.parse(event.data);
    const message = document.createElement('div');
    message.textContent = `${data.payload.from}: ${data.payload.message}`;
    messagesDiv.appendChild(message);
  };

  document.getElementById('sendBtn').addEventListener('click', function() {
    const to = document.getElementById('to').value;
    const message = document.getElementById('message').value;
    if (to && message) {
      const data = {
        type: 'message',
        payload: {
          from: username,
          to: to,
          message: message
        }
      };
      ws.send(JSON.stringify(data));
    }
  });
});

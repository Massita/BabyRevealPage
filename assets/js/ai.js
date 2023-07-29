const chat = document.getElementById('chat');
const input = document.getElementById('input');
const sendButton = document.getElementById('send');
const chatLog = [];

function sendMessage(message) {
    appendMessage(message, 'user', true);

    fetch('https://baby-name-reveal-e392f1eb024a.herokuapp.com/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            conversations: chatLog
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            const aiMessage = data.choices[0].message.content;
            appendMessage(aiMessage, 'assistant', true);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function appendMessage(content, role, saveMessage) {
    const messageElement = document.createElement('p');
    messageElement.className = `${role === 'user' ? 'from-me' : 'from-them'}`;
    messageElement.textContent = `${content}`;
    chat.appendChild(messageElement);
    chat.scrollTop = chat.scrollHeight;

    if (saveMessage) {
        // Save the message in the chat log and update localStorage
        chatLog.push({ role, content });

        if (chatLog.length > 10) {
            chatLog.shift();
        }

        localStorage.setItem("chatLog", JSON.stringify(chatLog));
    }
}

// Load the previous chat log from localStorage
chatLog.forEach(({ content, role }) => {
    appendMessage(content, role, false);
});

input.addEventListener("keypress", (e) => {
    if (e.which == 13) {
        const message = input.value;
        input.value = '';

        sendMessage(message);
    }
})

sendButton.addEventListener('click', () => {
    const message = input.value;
    input.value = '';

    sendMessage(message);
})

// 
const OPENAI_API_KEY = "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"; // Replace with your OpenAI API key
const CHAT_HISTORY = []; // Stores the conversation history

document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();

    if (message === '') return;

    appendMessage('user', message);
    userInput.value = '';

    // Add user message to chat history
    CHAT_HISTORY.push({ role: 'user', content: message });

    // Get bot response
    const botResponse = await getBotResponse(CHAT_HISTORY);
    appendMessage('bot', botResponse);

    // Add bot response to chat history
    CHAT_HISTORY.push({ role: 'assistant', content: botResponse });
}

async function getBotResponse(chatHistory) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: chatHistory,
                max_tokens: 150
            })
        });

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error fetching bot response:', error);
        return 'Sorry, I am unable to respond at the moment.';
    }
}

function appendMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
}

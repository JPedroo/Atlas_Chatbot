const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const form = document.getElementById('chat-form');

function formatResponse(response) {
  // Insere quebras de linha e formatações para parágrafos
  const formattedResponse = response
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Formatação em negrito
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Formatação em itálico
    .replace(/--/g, '<br>') // Quebras de linha onde houver "--"
    .replace(/\n/g, '<br>') // Adiciona quebras de linha quando necessário
    .replace(/:\s\*/g, ': <ul><li>') // Transforma asteriscos em listas
    .replace(/\*\s/g, '</li><li>') // Cria novos itens de lista
    .replace(/<\/li><li>$/, '</li></ul>'); // Finaliza a lista

  return formattedResponse;
}

async function sendMessage() {
  const userMessage = userInput.value;
  userInput.value = ''; // Clear input field
  console.log(userMessage);
  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput: userMessage }),
    });

    const data = await response.json();
    console.log(data);
    const botMessage = formatResponse(data.response);
    console.log(botMessage);
    // Add chat message to the chat history
    chatHistory.innerHTML += `<div class="user-message">${userMessage}</div>`;
    chatHistory.innerHTML += `<div class="bot-message">${botMessage}</div>`;

    // Scroll to the bottom of the chat history
    chatHistory.scrollTop = chatHistory.scrollHeight;
  } catch (error) {
    console.error('Error:', error);
    // Handle errors gracefully, e.g., display an error message to the user
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent form submission
  const loader = document.getElementById('loader');
  loader.style.display = 'block'; // Show the loader
  sendMessage().finally(() => {
    loader.style.display = 'none'; // Hide the loader after the message is sent
  });
});
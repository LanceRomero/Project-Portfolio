import { model } from "./mainmodule.js";

const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn"); 
const chatContainer = document.querySelector(".chat-cont");
const suggestionsContainer = document.querySelector(".suggestions");

// Chat history stored only in memory (resets on refresh)
let conversationHistory = [];
console.log("Conversation History on page load: ", conversationHistory)

const possibleQuestions = [
    "What is the Force?",
    "What happened to Anakin Skywalker?",
    "What is the Jedi Code?",
    "What is the origin of the Sith?",
    "Give me a short history of the Galactic Empire",
    "Who is your most trusted ally?",
    "Why do you speak in inverted syntax?",
    "Who is the chosen one?",
    "What is your real name?",
    "Why do lightsabers have different colors?",
    "Give me an advice"
];

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createSuggestionCards() {
    suggestionsContainer.innerHTML = '';
    const selectedQuestions = shuffleArray([...possibleQuestions]).slice(0, 4);
    
    selectedQuestions.forEach(question => {
        const card = document.createElement('div');
        card.classList.add('suggestion-card');
        card.textContent = question;
        
        card.addEventListener('click', () => {
            chatInput.value = question;
            handleAPI();
            suggestionsContainer.parentElement.style.display = 'none';
        });
        
        suggestionsContainer.appendChild(card);
    });
}

// Initialize suggestions on page load
window.addEventListener('load', createSuggestionCards);

// Function to auto-scroll to the latest message
const scrollToBottom = () => {
    chatContainer.scrollTop = chatContainer.scrollHeight;
};

// Function to format response text
const formatResponse = (text) => {
    text = text.replace(/^\*\s*/, "").trim();

    let formattedText = text
        .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br>");

    if (text.match(/^(-|\*)\s/gm)) {
        formattedText = "<ul>" +
            formattedText
                .split("<br>")
                .map(line => {
                    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
                        return `<li>${line.substring(2)}</li>`;
                    }
                    return `<p>${line}</p>`;
                })
                .join("") +
            "</ul>";
    }

    return formattedText;
};

// Function to generate AI response using conversation history
const getChatResponse = async () => {
    const userText = chatInput.value;
    console.log("User Input: ", userText);
    const pEle = document.createElement("div");

    // Append user message to conversation history
    conversationHistory.push({ role: "user", content: userText });

    try {
        // Send full chat history as context
        const fullContext = conversationHistory.map(entry => `${entry.role}: ${entry.content}`).join("\n");
        const result = await model.generateContent(fullContext);

        console.log("AI says: ", result);
        const response = await result.response.text();
        console.log("AI says (text form): ", response);

        // Append AI response to conversation history
        conversationHistory.push({ role: "ai", content: response });

        pEle.classList.add("chat-content", "left");
        pEle.innerHTML = `
        <div class="avatar">
          <img src="Yoda_icon.png" alt="Jedi" width="50" height="50" style="border-radius: 50%; display: block;">
        </div>
            <div class="chat-body-inner right">
                <p>${formatResponse(response)}</p>
            </div>
        `;
    } catch (error) {
        pEle.classList.add("chat-content", "left");
        console.error("Error fetching AI response: ", error);
        pEle.innerHTML = `
        <div class="avatar">
          <img src="error_icon.png" alt="Yoda" width="50" height="50" style="border-radius: 50%; display: block;">
        </div>
            <div class="chat-body-inner right">
                <p>Something went wrong, please try again later</p>
            </div>
        `;
    }

    chatContainer.appendChild(pEle);
    scrollToBottom();
};

// Function to handle user input and send request to AI
const handleAPI = () => {
    const userText = chatInput.value.trim();
    if (!userText) return;

    const suggestionContainer = document.querySelector('.suggestion-container');
    if (suggestionContainer) {
        suggestionContainer.style.display = 'none';
    }

    getChatResponse();
    chatInput.value = "";

    const chatBubble = document.createElement("div");
    chatBubble.classList.add("chat-content", "right");
    chatBubble.innerHTML = `
    <div class="avatar">
        <img src="jedi.png" alt="Jedi" width="50" height="50" style="border-radius: 50%; display: block;">
    </div>
        <div class="chat-body-inner left"> 
            <p>${userText}<p>
        </div>
    `;
    chatContainer.appendChild(chatBubble);
    scrollToBottom();
};

sendButton.addEventListener("click", handleAPI);

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleAPI();
    }
});
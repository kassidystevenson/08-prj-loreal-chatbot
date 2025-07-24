// // /* DOM elements */
// const chatForm = document.getElementById("chatForm");
// const userInput = document.getElementById("userInput");
// const chatWindow = document.getElementById("chatWindow");

// // Set initial message
// chatWindow.textContent = "👋 Hello! How can I help you today?";

// /* Handle form submit */
// chatForm.addEventListener("submit", (e) => {
//   e.preventDefault();

//   // When using Cloudflare, you'll need to POST a `messages` array in the body,
//   // and handle the response using: data.choices[0].message.content

//   // Show message
//   chatWindow.innerHTML = "Connect to the OpenAI API for a response!";
// }); // This script handles the chat functionality using the OpenAI API.
// // Students: Read the comments to understand each part!


// Get your API key from secrets.js
const OPENAI_API_KEY = window.OPENAI_API_KEY;


// Get references to chat form elements
const chatForm = document.getElementById("chatForm"); // The form for chat
const userInput = document.getElementById("userInput"); // The text input field
const chatWindow = document.getElementById("chatWindow"); // The area to show messages


// Function to check if the question is about L'Oréal or skincare/haircare
function isLorealRelated(question) {
 // Convert question to lowercase for easier matching
 const q = question.toLowerCase();


 // Keywords for L'Oréal, skincare, haircare, and products
 const lorealKeywords = [
   "l'oréal",
   "loreal",
   "paris",
   "product",
   "skincare",
   "haircare",
   "shampoo",
   "conditioner",
   "serum",
   "routine",
   "cream",
   "moisturizer",
   "face wash",
   "makeup",
   "foundation",
   "lipstick",
   "mascara",
   "cleanser",
 ];


 // Check if any keyword is found in the question
 return lorealKeywords.some((keyword) => q.includes(keyword));
}


// Function to add a message to the chat window
function addMessage(sender, text) {
 // Create a new div for the message
 const messageDiv = document.createElement("div");
 // Style based on sender
 messageDiv.className = sender === "user" ? "user-message" : "bot-message";
 messageDiv.textContent = text;
 // Add to chat window
 chatWindow.appendChild(messageDiv);
 // Scroll to bottom so latest message is visible
 chatWindow.scrollTop = chatWindow.scrollHeight;
}


// Function to send user input to OpenAI and get a response
async function getOpenAIResponse(userMessage) {
 // Show a loading message while waiting for the API
 addMessage("bot", "Typing...");


 try {
   // Prepare the API request
   const endpoint = "https://api.openai.com/v1/chat/completions";
   const body = {
     model: "gpt-4o", // Use the gpt-4o model
     messages: [
       {
         role: "system",
         content:
           "You are an AI assistant specialized in L’Oréal-related topics. If a user asks a question unrelated to L’Oréal products, beauty routines, skincare, makeup, haircare, or related recommendations, politely refuse to answer and gently redirect the conversation back to L’Oréal topics. Always maintain a helpful and courteous tone.",
       },
       { role: "user", content: userMessage },
     ],
     max_tokens: 200,
   };


   // Send the request using fetch and await the response
   const response = await fetch(endpoint, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       Authorization: `Bearer ${OPENAI_API_KEY}`,
     },
     body: JSON.stringify(body),
   });


   // Remove the "Typing..." message
   chatWindow.lastChild.remove();


   // Parse the response as JSON
   const data = await response.json();


   // Check if the response contains a valid message
   if (data && data.choices && data.choices[0] && data.choices[0].message) {
     addMessage("bot", data.choices[0].message.content.trim());
   } else {
     addMessage("bot", "Sorry, I couldn't get a response from the assistant.");
   }
 } catch (error) {
   chatWindow.lastChild.remove();
   addMessage("bot", "Oops! Something went wrong. Please try again later.");
   console.error("OpenAI API error:", error);
 }
}


// Function to handle user input and bot response
async function handleChat(event) {
 event.preventDefault(); // Stop form from submitting normally


 // Get the user's question from the input field
 const question = userInput.value.trim();
 if (question === "") return; // Ignore empty input


 // Show user's message in the chat window
 addMessage("user", question);


 // Check if the question is related to L'Oréal or skincare/haircare
 if (!isLorealRelated(question)) {
   // If not related, politely refuse and redirect
   addMessage(
     "bot",
     "Sorry, I can only answer questions about L’Oréal products and skincare or haircare routines. Please ask me something related to L’Oréal or beauty care!"
   );
   userInput.value = ""; // Clear input
   return;
 }


 // Send request to OpenAI for chatbot response
 await getOpenAIResponse(question);


 userInput.value = ""; // Clear input
}


// Listen for form submit and call handleChat when the user sends a message
chatForm.addEventListener("submit", handleChat);
// If related, call OpenAI API for a response
await getOpenAIResponse(question);


userInput.value = ""; // Clear input


// Listen for form submit
chatForm.addEventListener("submit", handleChat);
async function handleChat(event) {
 event.preventDefault(); // Stop form from submitting normally


 const userInput = document.getElementById("userInput");
 const question = userInput.value.trim();


 if (question === "") return; // Ignore empty input


 addMessage("user", question); // Show user's message


 // Check if the question is related to L'Oréal or skincare/haircare
 if (!isLorealRelated(question)) {
   // If not related, politely refuse and redirect
   addMessage(
     "bot",
     "Sorry, I can only answer questions about L’Oréal products and skincare or haircare routines. " +
       "Please ask me something related to L’Oréal or beauty care!"
   );
   userInput.value = ""; // Clear input
   return;
 }


 // If related, call OpenAI API for a response
 addMessage("bot", "Thinking..."); // Show bot is working


 // Build the prompt for OpenAI
 const prompt = `You are a helpful assistant for L’Oréal. Only answer questions about L’Oréal products and skincare/haircare routines. If asked anything else, politely refuse and redirect to L’Oréal topics. Question: ${question}`;


 // Call OpenAI API using fetch (beginner-friendly, no npm libraries)
 try {
   const response = await fetch("https://api.openai.com/v1/chat/completions", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       // Use your OpenAI API key from secrets.js
       Authorization: `Bearer ${OPENAI_API_KEY}`,
     },
     body: JSON.stringify({
       model: "gpt-4o",
       messages: [
         {
           role: "system",
           content:
             "You are a helpful assistant for L’Oréal. Only answer questions about L’Oréal products and skincare/haircare routines. If asked anything else, politely refuse and redirect to L’Oréal topics.",
         },
         { role: "user", content: question },
       ],
       max_tokens: 200,
     }),
   });


   const data = await response.json();


   // Remove "Thinking..." message
   const chatWindow = document.getElementById("chatWindow");
   chatWindow.lastChild.remove();


   // Show the bot's reply
   if (data.choices && data.choices[0] && data.choices[0].message) {
     addMessage("bot", data.choices[0].message.content);
   } else {
     addMessage("bot", "Sorry, I couldn't find an answer. Please try again!");
   }
 } catch (error) {
   // Remove "Thinking..." message
   const chatWindow = document.getElementById("chatWindow");
   chatWindow.lastChild.remove();


   addMessage(
     "bot",
     "Sorry, there was a problem connecting to the chatbot. Please try again later."
   );
 }


 userInput.value = ""; // Clear input
}


// Listen for form submit
document.getElementById("chatForm").addEventListener("submit", handleChat);





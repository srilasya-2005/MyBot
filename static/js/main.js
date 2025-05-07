document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatContainer = document.getElementById('chat-container');
    const suggestionCards = document.querySelectorAll('.suggestion-card');
    const newChatBtn = document.querySelector('.new-chat-btn');
    const collapseBtn = document.querySelector('.collapse-btn');
    const sideNav = document.querySelector('.side-nav');
    
    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Get current time in HH:MM AM/PM format
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Create typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = 'P';
        
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'message-content';
        dotsContainer.innerHTML = `
            <div class="typing-dots">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(dotsContainer);
        chatContainer.appendChild(typingDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return typingDiv;
    }
    
    // Remove typing indicator
    function removeTypingIndicator(typingElement) {
        if (typingElement && typingElement.parentNode) {
            typingElement.classList.add('fade-out');
            setTimeout(() => {
                typingElement.remove();
            }, 300);
        }
    }
    
    // Add message to chat
    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = isUser ? 'You' : 'PB';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const textElement = document.createElement('div');
        textElement.className = 'message-text';
        textElement.textContent = text;
        
        const timeElement = document.createElement('span');
        timeElement.className = 'message-time';
        timeElement.textContent = getCurrentTime();
        
        content.appendChild(textElement);
        content.appendChild(timeElement);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        // Remove welcome screen if first user message
        const welcomeScreen = document.querySelector('.welcome-screen');
        if (isUser && welcomeScreen) {
            welcomeScreen.classList.add('fade-out');
            setTimeout(() => {
                welcomeScreen.remove();
            }, 300);
        }
        
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Return the message element for potential streaming
        return textElement;
    }
    
    // Send message to server
    async function sendMessage(message) {
        if (!message.trim()) return;
        
        addMessage(message, true);
        userInput.value = '';
        userInput.style.height = 'auto';
        
        const typingElement = showTypingIndicator();
        sendButton.disabled = true;
        
        try {
            const response = await fetch('/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `user_input=${encodeURIComponent(message)}`
            });
            
            const data = await response.json();
            removeTypingIndicator(typingElement);
            
            const messageElement = addMessage(data.response, false);
            
            // Handle goodbye messages
            if (data.response.toLowerCase().includes('goodbye')) {
                setTimeout(() => {
                    addMessage("You can start a new conversation anytime by typing a message.", false);
                }, 1000);
            }
            
            // Simulate streaming effect
            simulateStreaming(messageElement, data.response);
            
        } catch (error) {
            removeTypingIndicator(typingElement);
            addMessage("Sorry, I'm having trouble connecting. Please try again later.", false);
            console.error('Error:', error);
        } finally {
            sendButton.disabled = false;
        }
    }
    
    // Simulate streaming response
    function simulateStreaming(element, text) {
        element.textContent = '';
        let i = 0;
        const speed = 10 + Math.random() * 20; // Random speed for natural feel
        
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                chatContainer.scrollTop = chatContainer.scrollHeight;
                setTimeout(typeWriter, speed);
            }
        }
        
        typeWriter();
    }
    
    // Event Listeners
    sendButton.addEventListener('click', () => {
        sendMessage(userInput.value);
    });
    
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(userInput.value);
        }
    });
    
    // Suggestion cards
    suggestionCards.forEach(card => {
        card.addEventListener('click', () => {
            const suggestionText = card.querySelector('h3').textContent;
            userInput.value = suggestionText;
            userInput.focus();
        });
    });
    
    // New chat button
    newChatBtn.addEventListener('click', () => {
        if (chatContainer.querySelector('.message') && 
            confirm('Start a new chat? Your current conversation will be cleared.')) {
            chatContainer.innerHTML = `
                <div class="welcome-screen">
                    <div class="welcome-content">
                        <div class="logo-mark">
                            <div class="logo-icon">PB</div>
                            <h1>Penny Bot</h1>
                        </div>
                        <h2>How can I help you today?</h2>
                        
                        <div class="suggestion-grid">
                            <div class="suggestion-card">
                                <i class="fas fa-lightbulb"></i>
                                <h3>Explain quantum physics</h3>
                                <p>In simple terms anyone can understand</p>
                            </div>
                            <div class="suggestion-card">
                                <i class="fas fa-calendar-day"></i>
                                <h3>What's the date today?</h3>
                                <p>Get current date and calendar information</p>
                            </div>
                            <div class="suggestion-card">
                                <i class="fas fa-clock"></i>
                                <h3>Current time</h3>
                                <p>Check the time in different timezones</p>
                            </div>
                            <div class="suggestion-card">
                                <i class="fas fa-face-laugh-squint"></i>
                                <h3>Tell me a joke</h3>
                                <p>Sheldon-style science humor</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Reattach event listeners to new suggestion cards
            document.querySelectorAll('.suggestion-card').forEach(card => {
                card.addEventListener('click', () => {
                    const suggestionText = card.querySelector('h3').textContent;
                    userInput.value = suggestionText;
                    userInput.focus();
                });
            });
        }
    });
    
    // Collapse sidebar
    collapseBtn.addEventListener('click', () => {
        sideNav.classList.toggle('collapsed');
        collapseBtn.querySelector('i').classList.toggle('fa-chevron-left');
        collapseBtn.querySelector('i').classList.toggle('fa-chevron-right');
    });
    
    // Focus input on load
    userInput.focus();
});
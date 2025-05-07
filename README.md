# Penny Bot 🤖

A Flask-based chatbot that combines the wit of Penny from The Big Bang Theory with the intelligence of Google's Gemini AI. The bot features special commands for jokes, date/time queries, and natural conversation.

## Features

- 🗣️ Natural conversation powered by Gemini AI
- 😄 Random Big Bang Theory themed jokes
- 🕒 Date and time queries
- ✨ Particle.js animated background
- ⏱️ Natural response timing

## Prerequisites

- Python 3.8+
- Flask
- Google Generative AI library

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/penny-bot.git
cd penny-bot
```

2. Install required packages:
```bash
pip install flask google-generativeai
```

3. Set up your Google API key:
   - Get your API key from Google AI Studio
   - Replace the placeholder API key in `app.py`

## Usage

1. Start the server:
```bash
python app.py
```

2. Open your browser and navigate to:
```
http://127.0.0.1:5000
```

## Special Commands

- **Jokes**: Ask "Tell me a joke" or include "joke" in your message
- **Date**: Ask "What's the date?" or include "date" in your message
- **Time**: Ask "What time is it?" or include "time" in your message
- **Day**: Ask "What day is it?" or include "day" in your message
- **Exit**: Say "goodbye", "bye", or "exit" to end the conversation

## Project Structure

```
penny-bot/
├── app.py              # Main Flask application
├── static/
│   ├── css/
│   │   ├── styles.css
│   │   └── animations.css
│   └── js/
│       ├── main.js
│       └── particles.js
├── templates/
│   └── index.html
└── jokes.json          # Collection of Sheldon-style jokes
```

## Security Note

⚠️ This is a development server. For production deployment, use a proper WSGI server and secure your API keys.

## License

MIT License

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

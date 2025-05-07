from flask import Flask, render_template, request, jsonify
import json
import random
from datetime import datetime
import google.generativeai as genai
from time import sleep

app = Flask(__name__, static_folder='static')

# Initialize Gemini AI
client = genai.configure(api_key="AIzaSyCFCBZuhiHjwaVR_cu_EZg2CKC7dMeutAI")
model = genai.GenerativeModel("gemini-1.5-flash")
chat = model.start_chat()

def load_json(filename):
    with open(filename, "r") as f:
        return json.load(f)

def random_joke():
    a = load_json("jokes.json")
    joke = random.choice(a["sheldon_jokes"])["joke"]
    return joke

def fetchDateTime(value):
    now = datetime.now()
    value = now.strftime(value)
    return value

def penny_bot(input_text):
    input_text = input_text.lower()
    if "joke" in input_text:
        return random_joke()
    elif "date" in input_text:
        return fetchDateTime("%B %d, %Y")
    elif "day" in input_text:
        return fetchDateTime("%A")
    elif "time" in input_text:
        return fetchDateTime("%I:%M %p")
    elif any(word in input_text for word in ["bye", "goodbye", "exit"]):
        return "Goodbye! Feel free to come back anytime."
    else:
        result = chat.send_message(input_text) 
        return result.text

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    user_input = request.form["user_input"]
    # Simulate natural response time
    sleep(random.uniform(0.5, 1.2))
    response = penny_bot(user_input)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
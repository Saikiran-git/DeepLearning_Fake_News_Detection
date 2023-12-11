from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize
from keras.preprocessing.text import one_hot
import numpy as np
import re
import nltk

nltk.download('stopwords')
nltk.download('punkt')


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the pre-trained LSTM model
model = load_model('model.h5')

# Set up Tokenizer for text processing
tokenizer = Tokenizer()
# Add any additional configuration for text processing here

# Text preprocessing function
def preprocess_text(text):
    ps = PorterStemmer()
    review = re.sub('[^a-zA-Z]', ' ', text)
    review = review.lower()
    review = word_tokenize(review)
    review = [ps.stem(word) for word in review if not word in stopwords.words('english')]
    review = ' '.join(review)
    return review

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    input_text = data['inputText']

    # Preprocess the user input using the same function as in the testing code
    processed_input = preprocess_text(input_text)

    # One-hot encode the preprocessed statement
    input_data = [one_hot(processed_input, 5000)]  # Assuming voc_size is defined
    sent_length = 20
    padded_input = pad_sequences(input_data, padding='pre', maxlen=sent_length)

    # Make predictions
    prediction = model.predict(np.array(padded_input))

    # Convert prediction to 0 or 1
    prediction = (prediction > 0.7).astype(int)

    # Assuming it's a binary classification, adjust the logic as needed
    result = 'Fake' if prediction[0][0] == 1 else 'True'

    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(port=3001)

import sklearn
from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import joblib
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('stopwords')
nltk.download('wordnet')

app = Flask(__name__)
CORS(app)

model = joblib.load('sentiment_model.pkl')
vectorizer = joblib.load('tfidf_vectorizer.pkl')
lemmatizer = WordNetLemmatizer()

def reprocess_text(text):
    text = text.lower()
    text = re.sub(r"n't", "not", text)
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words('english'))
    filtered_tokens = (lemmatizer.lemmatize(word) for word in tokens if word.isalnum() and word not in stop_words)
    return ' '.join(filtered_tokens)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        if not data or 'review' not in data:
            return jsonify({'error' : 'Invalid request: Missing Review'}), 400

        review = data['review']
        processed_review = reprocess_text(review)
        vectorize_review = vectorizer.transform([processed_review])
        prediction = model.predict(vectorize_review)[0]

        return jsonify({'sentiment': prediction})

    except Exception as e:
        return jsonify({'error': e})

#main class
if __name__ =='__main__':
    app.run(port=19372, debug=True)
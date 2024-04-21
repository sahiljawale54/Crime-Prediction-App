from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pandas as pd
import pickle

app = Flask(__name__, static_url_path='/static')

# Load the trained model
with open('CrimePredictionModel.pkl', 'rb') as file:
    model = pickle.load(file)

# Define the feature names expected by the model
feature_names = ['month', 'year', 'dayEncoded', 'hours', 'minutes', 'time_numeric', 'sessionEncoded', 'districtEncoded', 'locX', 'locY', 'descriptionEncoded']

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Get data from the request
    try:
        data = request.json
    
        # Convert data to DataFrame with feature names
        input_data = pd.DataFrame([data], columns=feature_names)
        
        # Make prediction
        prediction = model.predict(input_data)
        
        # Return prediction as JSON response
        return jsonify({'prediction': prediction.tolist()})
    
    except Exception as e:
        error_message = f"An error occurred: {str(e)}"
        return jsonify({'error': error_message}), 500  # 500 Internal Server Error


if __name__ == '__main__':
    app.run(debug=True)


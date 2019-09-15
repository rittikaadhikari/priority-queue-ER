from flask import Flask, request, render_template
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.neighbors import NearestNeighbors

import numpy as np 
import random
import pickle 

VECTORIZER_FILE = 'vectorizer.pkl'
CONDITION_FILE = 'condition.pkl'
SEVERITY_FILE = 'severity.pkl'
MODEL_FILE = 'model.pkl'

app = Flask(__name__)

@app.route('/getseverity', methods=['POST', 'GET'])
def get_severity():
    if request.method == 'POST':
        result = request.form
        return predict_and_retrain(result)
    
''' This function reads in the mock patient condition data. '''
def read_data(filename): 
    data = []
    with open(filename) as f: 
        for line in f:
            if line != '\n':
                split_line = line.split(':')
                data.append((split_line[0].strip().lower(), int(split_line[1].strip()) - 1))
    return data


''' Reads data, creates a vectorizer, and initializes the 
    nearest neighbors classifier. '''
def init():
    ## read data & separate x and y components
    data = read_data('train.txt')
    X = [tup[0] for tup in data]
    Y = [tup[1] for tup in data]


    ## create a vectorizer initialized with the most common stop words
    vectorizer = CountVectorizer(stop_words='english')

    words = vectorizer.fit_transform(X)
    feat_vecs = words.toarray()

    ## initialize nearest neighbors classifier
    nbrs = NearestNeighbors(n_neighbors=len(X), metric='cosine')
    nbrs.fit(feat_vecs)

    ## pickle files
    pickle_files(vectorizer, X, Y, nbrs)

    
''' This function accepts a condition and predicts the condition's severity
    using a voting system from the five nearest neighbors. Then, this updates the 
    current nearest neighbors model with the new entry to populate more data. '''
def predict_and_retrain(condition):
    ## unpickle all files
    vectorizer, x, y, nbrs = unpickle_files()

    ## uses vectorizer to get vector for condition string
    word_vec = vectorizer.transform([condition.lower()])
    
    ## gets the k-nearest neighbors of vector
    neighbors = nbrs.kneighbors(word_vec)
    neighbors_dist = neighbors[0][0]
    neighbors_idx = neighbors[1][0]
    
    ## uses voting system (first five neighbors) to determine
    ## best classification of severity for situation
    votes = [0, 0, 0, 0, 0]
    for i, d in zip(neighbors_idx[:5], neighbors_dist[:5]):
        if d < 1.0: 
            votes[y[i]] += 1
    
    ## get prediction
    prediction = np.argmax(np.asarray(votes))
    
    ## augment data with (word_vec, prediction)
    x.append(condition)
    y.append(prediction)
    
    ## re-fit vectorizer with new data
    words = vectorizer.fit_transform(x)
    
    ## re-fit nearest neighbors with new data
    nbrs.fit(words.toarray())

    ## pickle files with new updates
    pickle_files(vectorizer, x, y, nbrs)
    
    return prediction 

''' This function stores all of the necessary files 
    for severity prediction. '''
def pickle_files(vectorizer, x, y, model):
    ## pickle model
    with open(MODEL_FILE, 'wb') as fid:
        pickle.dump(model, fid, 2)

    ## pickle vectorizer
    with open(VECTORIZER_FILE, 'wb') as fid:
        pickle.dump(vectorizer, fid, 2)

    ## pickle condition
    with open(CONDITION_FILE, 'wb') as fid:
        pickle.dump(x, fid, 2)

    ## pickle severity
    with open(SEVERITY_FILE, 'wb') as fid:
        pickle.dump(y, fid, 2)

''' This function unpacks all of the compressed files
    for prediction. '''
def unpickle_files():
    ## unpickle model
    pkl_file = open(MODEL_FILE, 'rb')
    model = pickle.load(pkl_file)
    pkl_file.close()

    ## unpickle vectorizer
    pkl_file = open(VECTORIZER_FILE, 'rb')
    vectorizer = pickle.load(pkl_file)
    pkl_file.close()

    ## unpickle condition
    pkl_file = open(CONDITION_FILE, 'rb')
    x = pickle.load(pkl_file)
    pkl_file.close()

    ## unpickle severity
    pkl_file = open(SEVERITY_FILE, 'rb')
    y = pickle.load(pkl_file)
    pkl_file.close()

    return vectorizer, x, y, model

if __name__ == '__main__':
    init()
    app.run(host='0.0.0.0', port=5000)
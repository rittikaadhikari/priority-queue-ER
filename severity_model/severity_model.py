from sklearn.feature_extraction.text import CountVectorizer
from sklearn.neighbors import NearestNeighbors

import numpy as np 
import random

''' This function reads in the mock patient condition data. '''
def read_data(filename): 
    data = []
    with open(filename) as f: 
        for line in f:
            if line != '\n':
                split_line = line.split(':')
                data.append((split_line[0].strip().lower(), int(split_line[1].strip()) - 1))
    return data

''' This function accepts a condition and predicts the condition's severity
    using a voting system from the five nearest neighbors. Then, this updates the 
    current nearest neighbors model with the new entry to populate more data. '''
def predict_and_retrain(condition): 
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
            votes[Y[i]] += 1
    
    ## get prediction
    prediction = np.argmax(np.asarray(votes))
    
    ## augment data with (condition, prediction)
    X.append(condition)
    Y.append(prediction)
    
    ## re-fit vectorizer with new data
    words = vectorizer.fit_transform(X)
    
    ## re-fit nearest neighbors with new data
    nbrs.fit(words.toarray())
    
    return prediction 

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
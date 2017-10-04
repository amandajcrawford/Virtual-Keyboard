from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename


from flask import make_response, request, current_app
from functools import update_wrapper

import unicodedata
import json
import pickle
import logging
import os
from flask import Flask,render_template, request,json
from flask_cors import CORS, cross_origin

import os.path
import sqlite3
import csv

app = Flask(__name__)
CORS(app)


WORDS = list()
for i in open('words.txt'):
    WORDS.append(i.split(',')[0].lower())



KEYBRD_LAYOUT = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

def match(path, word):
    """ Checks if a word is present in a path or not. """

    try:
        for char in word:
            path = path.split(char, 1)[1]
        return True
    except : return False

def get_keyboard_row( char ):
    """ Returns the row number of the character """

    for row_no, row in enumerate(KEYBRD_LAYOUT):
        if char in row:
            return row_no

def compress(sequence):
    """ Removes redundant sequential characters. ex : 11123311 => 1231 """
    ret_val = [ sequence[0] ]
    for element in sequence:
        if ret_val[-1] != element:
            ret_val.append(element)
    return ret_val

def get_minimum_wordlength(path):
    """
    Returns the minimum possible word length from the path.
    Uses the number of transitions from different rows in
    the keyboard layout to determin the minimum length
    """
    row_numbers = map(get_keyboard_row, path)
    compressed_row_numbers = compress(row_numbers)
    return len(compressed_row_numbers) - 3


def get_suggestion(path):
    """ Returns suggestions for a given path. """

    suggestions = filter(lambda x: x[0] == path[0] and x[-1] == path[-1], WORDS)
    suggestions = filter(lambda x: match(path, x), suggestions)

    min_length = get_minimum_wordlength(path)
    suggestions = filter(lambda x: len(x) > min_length, suggestions)
    return suggestions;

            #return json.dumps(data);
            #return resp

@app.route('/get_suggestion', methods=['GET', 'POST'])
@cross_origin()
def return_suggestion():
    if request.method == "POST":
        print request.form['data']
        #word = request.json['word']
        suggestions = get_suggestion(request.form['data'])
        data = {'suggestions': suggestions}
        print suggestions
        resp = jsonify(data)
        resp.status_code = 200
        return resp
if __name__ == "__main__":
    app.run()

from music21 import *
from music21.figuredBass import checker
from flask import Flask, render_template, request, jsonify, session
from markupsafe import escape
import sys
import io
import re
import ast


app = Flask(__name__)

trebleNotes = []
bassNotes = []
mistakes = []
mistakeValues = []
noteMap = {}

score = stream.Score()
treble = stream.Part()
bass = stream.Part()
high = stream.Voice()
low = stream.Voice()
para_oct = checker.parallelOctaves
para_fifth = checker.parallelFifths

# following block is done to modify output to console/turn output to regular string

output_buffer = io.StringIO()
original_stdout = sys.stdout
sys.stdout = output_buffer

@app.route("/") 
def  index():
    return render_template('index.html')

@app.route('/receive-hashmap', methods=['POST'])
def receive_map():
    # Parse the JSON data into a Python dictionary
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid or missing JSON"}), 400
    
    global noteMap
    noteMap = {int(key): value for key, value in data.items() }

    # Access the values from the dictionary (formerly Map in JS)
    return jsonify({
        "message": "Map received successfully",
    })

@app.route('/receive-arrays', methods=['POST'])
def receive_arrays():
    data = request.get_json()  # Extract JSON data from the request
    if not data or 'array1' not in data or 'array2' not in data:
        return jsonify({"error": "Both arrays are required"}), 400

    global trebleNotes
    trebleNotes = data['array1']  # Extract the first array
    global bassNotes
    bassNotes = data['array2']  # Extract the second array

    return jsonify({
        "message": "Arrays received",
        "array1": trebleNotes,
        "array2": bassNotes
    }), 200 

@app.route('/check-notes/', methods=['GET'])
def check_notes():
    newHigh = stream.Voice()
    for i in trebleNotes:
        a = note.Note(noteMap.get(i.get('y')))
        a.quarterLength = i.get('length') * 4
        newHigh.append(a)
    newLow = stream.Voice()
    for i in bassNotes:
        a = note.Note(noteMap.get(i.get('y')))
        a.quarterLength = i.get('length') * 4
        newLow.append(a)
    newTreble = stream.Part()
    newTreble.append(newHigh)
    newBass = stream.Part()
    newBass.append(newLow)
    global score
    score.clear()
    score.insert(0, newTreble)
    score.insert(0, newBass)
    checker.checkConsecutivePossibilities(music21Stream=score, functionToApply=para_oct, debug=True)
    checker.checkConsecutivePossibilities(music21Stream=score, functionToApply=para_fifth, debug=True)
    sys.stdout = original_stdout
    values = output_buffer.getvalue().split("\n")
    for i in range(len(values)):
        if (values[i] == 'Function To Apply: parallelOctaves'):
            a = i + 2
            while (values[a] != 'No violations to report.' and values[a] != 'Function To Apply: parallelFifths'):    
                mistakes.append(values[a])
                a += 1
            for j in range(len(mistakes)):
                print(mistakes[j])
                mistakes[j] = re.sub(r'\s+', ' ', mistakes[j])
                tuple_strs = mistakes[j].split(') (')
                cleaned_tuples = [ast.literal_eval(tup.replace('(', '').replace(')', ',')) for tup in tuple_strs]
                mistakes[j] =(tuple(cleaned_tuples))
            print(mistakes)
    return jsonify (mistakes), 500

if __name__ == '__main__':
    app.run(debug=True)
from music21 import *
from music21.figuredBass import checker
from flask import Flask, render_template, request, jsonify, session
from markupsafe import escape
import sys
import io
import re
import ast


app = Flask(__name__)
app.debug = True

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
    for i in trebleNotes:
        a = note.Note(noteMap.get(i.get('y')))
        a.quarterLength = 4
        global high
        high.append(a)
    for i in bassNotes:
        a = note.Note(noteMap.get(i.get('y')))
        a.quarterLength = 4
        global low
        low.append(a)
    global treble
    treble.append(high)
    global bass
    bass.append(low)
    global score
    score.insert(0, treble)
    score.insert(0, bass)
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
            print(mistakes)
            for j in range(len(mistakes)):
                mistakes[j] = re.sub(r'\s+', ' ', mistakes[j])
                tuple_strs = mistakes[j].split(') (')
                cleaned_tuples = [ast.literal_eval(tup.replace('(', '').replace(')', ',')) for tup in tuple_strs]
                mistakes[j] =(tuple(cleaned_tuples))
            print(mistakes)
    return jsonify (mistakes), 500

if __name__ == '__main__':
    app.run()
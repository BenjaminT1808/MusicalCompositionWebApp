from music21 import *
from music21.figuredBass import checker
from flask import Flask, render_template, request, jsonify
from markupsafe import escape

app = Flask(__name__)
app.debug = True

trebleNotes = []
bassNotes = []
noteMap = {}

score = stream.Score()
treble = stream.Part()
bass = stream.Part()
high = stream.Voice()
low = stream.Voice()
para_oct = checker.parallelOctaves
para_fifth = checker.parallelFifths

@app.route("/") 
def  index():
    return render_template('index.html')

@app.route('/receive-hashmap', methods=['POST'])
def receive_map():
    # Parse the JSON data into a Python dictionary
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid or missing JSON"}), 400
    
    noteMap = data

    # Access the values from the dictionary (formerly Map in JS)
    return jsonify({
        "message": "Map received successfully",
    })

@app.route('/receive-arrays', methods=['POST'])
def receive_arrays():
    data = request.get_json()  # Extract JSON data from the request
    if not data or 'array1' not in data or 'array2' not in data:
        return jsonify({"error": "Both arrays are required"}), 400

    trebleNotes = data['array1']  # Extract the first array
    bassNotes = data['array2']  # Extract the second array

    return jsonify({
        "message": "Arrays received",
        "array1": trebleNotes,
        "array2": bassNotes
    }), 200 

@app.route('/check-notes', methods=['GET'])
def check_notes():
    for i in trebleNotes:
        a = note.Note(noteMap.get(i[0]))
        a.quarterLength = 4
        high.append(a)
    for i in bassNotes:
        a = note.Note(noteMap.get(i[0]))
        a.quarterLength = 4
        low.append(a)
    treble.append(high)
    bass.append(low)
    score.insert(0, treble)
    score.insert(0, bass)
    


if __name__ == '__main__':
    app.run()
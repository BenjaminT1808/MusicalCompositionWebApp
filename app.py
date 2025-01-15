from music21 import *
from music21.figuredBass import checker
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
app.debug = True

trebleNotes = []
bassNotes = []
noteMap = {}

@app.route("/") 
def  index():
    return render_template('index.html')

@app.route('/receive-hashmap', methods=['POST'])
def receive_map():
    # Parse the JSON data into a Python dictionary
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid or missing JSON"}), 400

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



score = stream.Score()
treble = stream.Part()
bass = stream.Part()
high = stream.Voice()
low = stream.Voice()
print("hi")

para_oct = checker.parallelOctaves
para_fifth = checker.parallelFifths


if __name__ == '__main__':
    app.run()
import music21
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
app.debug = True

@app.route("/") 
def  index():
    return render_template('index.html')

@app.route("/api/data", methods=["POST"]) 
def api_data(): 
    data = request.get_json
    response = {"message": "Data received", "data": data}
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
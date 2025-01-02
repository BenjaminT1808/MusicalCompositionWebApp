import music21
from flask import Flask, render_template

app = Flask(__name__)
app.debug = True

@app.route('/')
def  home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()
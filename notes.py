from music21 import *
from music21.figuredBass import checker
from flask import *
from markupsafe import *

score = stream.Score()

part = stream.Part()

bass_line = stream.Part()

high_voice = stream.Voice()
low_voice = stream.Voice()

notes = ['C3', 'D3', 'E3', 'G3', 'A3', 'F3', 'E3', 'D3', 'C3']

for notename in notes:
    cantus = note.Note(notename)
    cantus.quarterLength = 4
    low_voice.append(cantus)

print (notes)
print('Please add an accompanying counter melody note by note')
for notename in notes:
    counter_melody = note.Note(input())
    counter_melody.quarterLength = 4
    high_voice.append(counter_melody)

part.append(high_voice)
bass_line.append(low_voice)
score.insert(0, part)
score.insert(0, bass_line)

para_oct = checker.parallelOctaves
para_fifth = checker.parallelFifths
checker.checkConsecutivePossibilities(music21Stream=score, functionToApply=para_oct, debug=True)
checker.checkConsecutivePossibilities(music21Stream=score, functionToApply=para_fifth, debug=True)


score.show()
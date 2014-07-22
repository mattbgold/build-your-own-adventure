from flask import Flask, jsonify, request, make_response, current_app, render_template
import time
import requests
import pycouchdb

try:
    # this is how you would normally import
    from flask.ext.cors import cross_origin
except:
    # support local usage without installed package
    from flask_cors import cross_origin

server = pycouchdb.Server()
couch = server.database("adventures")

app = Flask(__name__)



@app.route("/")
@app.route("/index")
def home():
    return render_template('AdventureEngine.html')

@app.route("/adventure/load")
@cross_origin(headers=['Content-Type'])
def alldocs():
    r = requests.get('http://localhost:5984/adventures/_design/adventureids/_view/all')
    return jsonify(r.json())
	
@app.route("/adventure/load/<id>", methods=['GET', 'POST', 'OPTIONS'])
@cross_origin(headers=['Content-Type'])
def loady(id):
    response = make_response(jsonify(couch.get(id)))
    return response

@app.route("/adventure/save", methods=['POST', 'OPTIONS'])
@cross_origin(headers=['Content-Type'])
def save():  
    #request.get_json works
    # add the curren time and store the story
    pretty_time = time.strftime("%m/%d/%y at %I:%M")
    epoch_time = int(time.time())
    raw_json = request.get_json()
    raw_json['last_edited'] = pretty_time
    raw_json['last_edited_epoch'] = epoch_time
    response = make_response(jsonify(couch.save(raw_json)))
    return response


if __name__ == "__main__":
    app.run()

import os 
import sys
import json
import wordninja
import difflib
from deep_translator import GoogleTranslator
from flask import Flask,render_template,url_for,redirect,request,jsonify 
print(sys.path)
app = Flask(__name__)
#Room State switch 
state_sw = {"Room1":{"sw1":"OFF","sw2":"OFF","sw3":"OFF"},
            "Room2":{"sw1":"OFF","sw2":"OFF","sw3":"OFF"},
            "Room3":{"sw1":"OFF","sw2":"OFF","sw3":"OFF"},
            "Room4":{"sw1":"OFF","sw2":"OFF","sw3":"OFF"},
            "Door1":{"sw1":"OFF","sw2":"OFF","sw3":"OFF"}
            }
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.
     #Word processing data of the control command function 
word_dbsim = {"Turn on the light in room 1":"Room1",
              "Turn on the light in room 2":"Room2",
              "Turn on the light in room 3":"Room3",
              "Turn on the light in room 4":"Room4",
              "Turn off the light in room 1":"Room1",
              "Turn off the light in room 2":"Room2",
              "Turn off the light in room 3":"Room3",
              "Turn off the light in room 4":"Room4",
              "Open the door 1":"Door1",
              "Close the door 1":"Door1" 
             }  
ref_state = {"Turn on the light in room":"ON","Turn off the light in room":"OFF","Open the door":"Open","Close the door":"Close"}
def wordintersection(list1,list2):
        set1 = set(list1)
        set2 = set(list2)
        # Find the intersection
        intersection = set1.intersection(set2)
        # Convert the result back to a list if needed
        intersection_list = list(intersection)
        print(intersection_list) 
        return intersection_list
def calculate_similarity(word1, word2):
    matcher = difflib.SequenceMatcher(None, word1, word2)
    return matcher.ratio()*100

@app.route("/")
def index():

      return render_template("index.html")
@app.route("/Sensordashboard")
def codegenerator():
       
      return render_template("sensordashboard.html")
@app.route("/Sensordata")
def sensor_datacode():
      return render_template("sensor_dashboard.html")
@app.route("/assistant_text_resp",methods=['GET','POST'])
def speech_assistant_ai():
     request_assistant = request.get_json(force=True) 
     print("Message AI assistant: ",request_assistant)
     #>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
     #Processing the word splitter 
     raw_text = request_assistant.get("text") # Get the raw text data function to translate at the back-end translator 
     result = GoogleTranslator(source='auto', target='en').translate(raw_text)
     print(result)    
     word_splitproc = wordninja.split(result)
     print("Command splitter: ",word_splitproc) # Get the word split processing data                 
     #Find the loop intersection of similarity
     #Get the dict of dict of the similarity check
     dic_ratio = {} 
     for dbsim in word_dbsim:
              print(dbsim)
              datasim = calculate_similarity(result, dbsim)
              ref_word = wordninja.split(dbsim)
              intersec_word =   wordintersection(word_splitproc,ref_word)
              print("Word similarity: ",datasim,intersec_word) 
              dic_ratio[dbsim] = datasim
     print(dic_ratio)      
     max_key = max(dic_ratio, key=dic_ratio.get)
     max_value = dic_ratio[max_key]
     print("Selected sw control: ",max_key)
     Control_Selected  = word_dbsim.get(max_key)
     print("Selected control switch function: ",Control_Selected,state_sw.get(Control_Selected))
       
     #print("Check state select: ",)
     #Check the state ON/OFF ligth using the current data
     state_selected = {} 
     for dbsim in ref_state:
                datasim = calculate_similarity(result, dbsim)
                print("Calculate ref_state selection", datasim)
                state_selected[dbsim] =  datasim
     print("Find the maximum in the list",state_selected)
     statemax_key = max(state_selected, key=state_selected.get)
     statemax_value = state_selected[statemax_key]
     print("Selected state: ",statemax_key)
     Statedata_Selected  = ref_state.get(statemax_key)
     print("Key select state: ",Statedata_Selected)
     
     if Statedata_Selected == "ON":
        state_sw.get(Control_Selected)["sw1"] = "ON"
        state_sw.get(Control_Selected)["sw2"] = "ON"
        state_sw.get(Control_Selected)["sw3"] = "ON" 
     if Statedata_Selected == "OFF":
        state_sw.get(Control_Selected)["sw1"] = "OFF"
        state_sw.get(Control_Selected)["sw2"] = "OFF"
        state_sw.get(Control_Selected)["sw3"] = "OFF" 
     if Statedata_Selected == "Open":
        state_sw.get(Control_Selected)["sw1"] = "ON"
        state_sw.get(Control_Selected)["sw2"] = "ON"
        state_sw.get(Control_Selected)["sw3"] = "ON" 
     if Statedata_Selected == "Close":
        state_sw.get(Control_Selected)["sw1"] = "OFF"
        state_sw.get(Control_Selected)["sw2"] = "OFF"
        state_sw.get(Control_Selected)["sw3"] = "OFF" 

     #>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
     return jsonify(request_assistant)

@app.route("/dataget",methods=["GET","POST"])
def datagetrequest():
    
     return jsonify(state_sw)

if __name__ == "__main__":

       app.run(ssl_context='adhoc',debug=True,threaded=True,host="0.0.0.0",port=5899)

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
// Replace with your network credentials
const char* ssid = "Idatabots";
const char* password = "Rkl3548123#";

// Replace with your desired URL
const char* url = "https://192.168.50.55:5899/dataget";
//Relay pin control
const int Relay_pin1 = 4;  // the number of the LED pin
const int Relay_pin2 = 5; 
const int Relay_pin3 = 6; 
int relay1state = HIGH; 
int relay2state = HIGH; 
int relay3state = HIGH;
void setup() {
  Serial.begin(115200);
  //Config relay pin parameters 
  Serial.print("Room 2");
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("Connected to Wi-Fi");
  pinMode(Relay_pin1, OUTPUT);
  pinMode(Relay_pin2, OUTPUT);
  pinMode(Relay_pin3, OUTPUT);
  digitalWrite(Relay_pin1,relay1state);
  digitalWrite(Relay_pin2,relay2state);
  digitalWrite(Relay_pin3,relay3state);
  
}

void loop() {
  // put your main code here, to run repeatedly:
  // Perform the HTTPS GET request
  
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    http.begin(url);
    int httpCode = http.GET();

    if (httpCode > 0) { // Check for the returning code
      String payload = http.getString();
      Serial.println(httpCode);
      Serial.println(payload);
      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      StaticJsonDocument<200> doc;

  // Parse the JSON payload
  DeserializationError error = deserializeJson(doc, payload);

  // Check for errors in parsing
  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.c_str());
    return;
  }

  // Extract values using keys
  const char* sw1_status = doc["Room2"]["sw1"];
  const char* sw2_status = doc["Room2"]["sw2"]; 
  const char* sw3_status = doc["Room2"]["sw3"];  
 
  // Print the extracted values
  Serial.println("Room_2:");
  Serial.print("SW1:");
  Serial.println(sw1_status);
  Serial.print("SW2:"); 
  Serial.println(sw2_status);   
  Serial.print("SW3:");
  Serial.println(sw3_status); 
  if(String(sw1_status) == "ON"){
     Serial.println("Trigger sw1 Relay");
     relay1state  = LOW;
     digitalWrite(Relay_pin1,relay1state);
  };
  if(String(sw1_status) == "OFF"){
     Serial.println("Trigger sw1 Relay");
     relay1state = HIGH;
     digitalWrite(Relay_pin1,relay2state);
  };

  if(String(sw2_status) == "ON"){
     Serial.println("Trigger sw2 Relay");
      relay2state  = LOW;
     digitalWrite(Relay_pin2,relay2state);
  };
  if(String(sw2_status) == "OFF"){
     Serial.println("Trigger sw2 Relay");
      relay2state  = HIGH;
     digitalWrite(Relay_pin2,relay2state);
  };
  if(String(sw3_status) == "ON"){
     Serial.println("Trigger sw3 Relay");
     relay3state  = LOW;
     digitalWrite(Relay_pin3,relay3state);
  };
  if(String(sw3_status) == "OFF"){
     Serial.println("Trigger sw3 Relay");
     relay3state  = HIGH;
     digitalWrite(Relay_pin3,relay3state);
  };
  

      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    } else {
      Serial.println("Error on HTTP request");
    }
    
    http.end(); // Free resources
  }
}

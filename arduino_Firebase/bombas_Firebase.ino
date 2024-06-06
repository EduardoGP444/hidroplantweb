#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

const char *ssid = "RogStrix";
const char *password = "00000000";
const int relayPinReserva = 5;  // Pin del relé para nutrientes
const int relayPinNutrientes = 4;  // Pin del relé para reserva

ESP8266WebServer server(80);

void setup() {
  Serial.begin(115200);
  delay(10);

  pinMode(relayPinNutrientes, OUTPUT);
  pinMode(relayPinReserva, OUTPUT);

  // Conexión a la red WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(250);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println("IP: " + WiFi.localIP().toString());  // Imprime la IP en el puerto serial

  // Configuración del servidor web
  server.on("/", HTTP_GET, []() {
    server.send(200, "text/plain", "Accede a /encender para encender el relé de nutrientes o /encender1 para encender el relé de nutrientes por 1 segundo, /encender3 para encender el relé de reserva por 40 segundos, /encender4 para encender el relé de reserva por 30 segundos");
  });

  server.on("/encender", HTTP_GET, []() {
    // Encender relé de nutrientes por 2 segundos
    digitalWrite(relayPinNutrientes, HIGH);
    delay(2000);
    digitalWrite(relayPinNutrientes, LOW);
    
    server.send(200, "text/plain", "Relé de nutrientes encendido durante 2 segundos");
  });

  server.on("/encender1", HTTP_GET, []() {
    // Encender relé de nutrientes por 1 segundo
    digitalWrite(relayPinNutrientes, HIGH);
    delay(1000);
    digitalWrite(relayPinNutrientes, LOW);
    
    server.send(200, "text/plain", "Relé de nutrientes encendido durante 1 segundo");
  });

  server.on("/encender3", HTTP_GET, []() {
    // Encender relé de reserva por 30 segundos
    digitalWrite(relayPinReserva, HIGH);
    delay(30000);
    digitalWrite(relayPinReserva, LOW);
    
    server.send(200, "text/plain", "Relé de reserva encendido durante 40 segundos");
  });

  server.on("/encender4", HTTP_GET, []() {
    // Encender relé de reserva por 20 segundos
    digitalWrite(relayPinReserva, HIGH);
    delay(20000);
    digitalWrite(relayPinReserva, LOW);
    
    server.send(200, "text/plain", "Relé de reserva encendido durante 30 segundos");
  });

  server.begin();
}

void loop() {
  server.handleClient();
}



#include <Arduino.h>
#include <WiFi.h>
#include <FirebaseESP32.h>
#include <DHT.h>
#include <NewPing.h>
#include <addons/TokenHelper.h>
#include <Adafruit_Sensor.h>
#include <DHT_U.h>

// Define las credenciales WiFi y Firebase
#define WIFI_SSID "Asus"
#define WIFI_PASSWORD "bere1234"

#define API_KEY "AIzaSyCdK1J8cLVUb2HjV0xupa--6gp1KQS3LHQ"
#define DATABASE_URL "hidroplant-22ea4-default-rtdb.firebaseio.com"
#define USER_EMAIL "eduardogomezpalacios467@gmail.com"
#define USER_PASSWORD "egp751326"

// Define el pin de datos del sensor DHT
#define DHT_PIN 4

#define TRIG_PIN_NUTRIENTES 19
#define ECHO_PIN_NUTRIENTES 21

#define TRIG_PIN_PRINCIPAL 18
#define ECHO_PIN_PRINCIPAL 5

#define TRIG_PIN_RESERVA 23
#define ECHO_PIN_RESERVA 22

#define TRIGGER_PIN_ALTURA 17
#define ECHO_PIN_ALTURA 16

#define HEIGHT_RESERVA 8     // Altura del contenedor de reserva en centímetros
#define HEIGHT_PRINCIPAL 8   // Altura del contenedor principal en centímetros
#define HEIGHT_NUTRIENTES 8  // Altura del contenedor de nutrientes en centímetros
#define HEIGHT_ALTURA 100    // Altura máxima esperada para la altura en centímetros

#define ML_PER_CM 200  // Factor de conversión: 5 cm = 1000 ml
#define MAX_DISTANCE 400

DHT_Unified dht(DHT_PIN, DHT11);
NewPing sonarReserva(TRIG_PIN_RESERVA, ECHO_PIN_RESERVA);
NewPing sonarPrincipal(TRIG_PIN_PRINCIPAL, ECHO_PIN_PRINCIPAL);
NewPing sonarNutrientes(TRIG_PIN_NUTRIENTES, ECHO_PIN_NUTRIENTES);
NewPing sonarAltura(TRIGGER_PIN_ALTURA, ECHO_PIN_ALTURA, MAX_DISTANCE);

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
unsigned long ultrasonidosPrevMillis = 0;

void tokenStatusCallback(bool status) {
  // Callback para manejar el estado del token, si es necesario
  Serial.printf("Token status: %s\n", status ? "Connected" : "Disconnected");
}

void setup() {
  Serial.begin(115200);

  // Configuración de la conexión WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando a Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Conectado con IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  // Configuración de Firebase
  config.api_key = API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.database_url = DATABASE_URL;
  config.token_status_callback = tokenStatusCallback;

  Firebase.reconnectNetwork(true);
  fbdo.setBSSLBufferSize(4096, 1024);  // Ajusta el tamaño de los buffers para la transmisión de datos

  Firebase.begin(&config, &auth);
  Firebase.setDoubleDigits(2);

  // Inicializar sensor DHT
  dht.begin();
}

void loop() {
  if (Firebase.ready() && (millis() - sendDataPrevMillis > 40000 || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();

    // Lecturas del sensor DHT11
    sensors_event_t temperatureEvent, humidityEvent;

    // Lectura de la temperatura
    dht.temperature().getEvent(&temperatureEvent);
    if (!isnan(temperatureEvent.temperature)) {
      // Lectura exitosa de temperatura, enviar a Firebase
      Serial.printf("Temperatura: %.2f °C\n", temperatureEvent.temperature);
      Firebase.setString(fbdo, "/sensores/temperatura", String(temperatureEvent.temperature) + " °C");
    } else {
      // Error en la lectura de temperatura
      Serial.println("Error en la lectura de temperatura del sensor DHT11");
      Firebase.setString(fbdo, "/sensores/temperatura", "Error en la lectura de temperatura del sensor DHT11");
    }

    // Lectura de la humedad
    dht.humidity().getEvent(&humidityEvent);
    if (!isnan(humidityEvent.relative_humidity)) {
      // Lectura exitosa de humedad, enviar a Firebase
      Serial.printf("Humedad: %.2f%%\n", humidityEvent.relative_humidity);
      Firebase.setString(fbdo, "/sensores/humedad", String(humidityEvent.relative_humidity) + "%");
    } else {
      // Error en la lectura de humedad
      Serial.println("Error en la lectura de humedad del sensor DHT11");
      Firebase.setString(fbdo, "/sensores/humedad", "Error en la lectura de humedad del sensor DHT11");
    }

    Serial.println();
  }

  // Lecturas de ultrasonidos (cada 10 segundos)
  if (millis() - ultrasonidosPrevMillis > 10000 || ultrasonidosPrevMillis == 0) {
    ultrasonidosPrevMillis = millis();

    // Sección de lectura de ultrasonidos
    delay(500);  // Espera un poco para no saturar la lectura del sensor

    unsigned int distanciaReserva = sonarReserva.ping_cm();
    unsigned int distanciaPrincipal = sonarPrincipal.ping_cm();
    unsigned int distanciaNutrientes = sonarNutrientes.ping_cm();
    unsigned int distanciaAltura = sonarAltura.ping_cm();

    // Convierte las distancias a mililitros utilizando el factor de conversión
    int mlReserva = (distanciaReserva == 0) ? 0 : map(distanciaReserva, 0, HEIGHT_RESERVA, ML_PER_CM * HEIGHT_RESERVA, 0);
    int mlPrincipal = (distanciaPrincipal == 0) ? 0 : map(distanciaPrincipal, 0, HEIGHT_PRINCIPAL, ML_PER_CM * HEIGHT_PRINCIPAL, 0);
    int mlNutrientes = (distanciaNutrientes == 0) ? 0 : map(distanciaNutrientes, 0, HEIGHT_NUTRIENTES, ML_PER_CM * HEIGHT_NUTRIENTES, 0);

    Serial.print("Nivel de agua - Reserva: ");
    Serial.print(mlReserva);
    Serial.print(" ml, Principal: ");
    Serial.print(mlPrincipal);
    Serial.print(" ml, Nutrientes: ");
    Serial.print(mlNutrientes);
    Serial.println(" ml");

    // Envía datos a Firebase
    Firebase.setString(fbdo, "/Ultrasonicos/Reserva", String(mlReserva) + " ml");
    Firebase.setString(fbdo, "/Ultrasonicos/Principal", String(mlPrincipal) + " ml");
    Firebase.setString(fbdo, "/Ultrasonicos/Nutrientes", String(mlNutrientes) + " ml");

    // Marca los errores en Firebase
    if (distanciaReserva == 0)
      Firebase.setString(fbdo, "/Ultrasonicos/Reserva", "Error en el sensor ultrasonido de reserva");

    if (distanciaPrincipal == 0)
      Firebase.setString(fbdo, "/Ultrasonicos/Principal", "Error en el sensor ultrasonido principal");

    if (distanciaNutrientes == 0)
      Firebase.setString(fbdo, "/Ultrasonicos/Nutrientes", "Error en el sensor ultrasonido de nutrientes");

    // Lectura y envío del sensor de altura
    if (distanciaAltura > 0) {
      Serial.print("Altura: ");
      Serial.print(distanciaAltura);
      Serial.println(" cm");
      Firebase.setString(fbdo, "/alturaPlanta", String(distanciaAltura) + " cm");
    } else {
      Serial.println("Error en la lectura del sensor ultrasonido de altura");
      Firebase.setString(fbdo, "/alturaPlanta", "Error en la lectura del sensor ultrasonido de altura");
    }
  }
}
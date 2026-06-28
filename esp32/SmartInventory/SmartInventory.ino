// ================================
// FINAL STABLE INVENTORY SYSTEM
// (NO FREEZE, NO STUCK ZERO)
// ================================

#define IR1 4
#define IR2 13

#define TRIG1 5
#define ECHO1 18

#define TRIG2 19
#define ECHO2 21

const int MAX_ITEMS = 8;

// START EMPTY (safe)
int stockA = 0;
int stockB = 0;

// smoothing memory
int lastStableA = 0;
int lastStableB = 0;

// IR tracking (optional enhancement)
bool lastIR1 = HIGH;
bool lastIR2 = HIGH;

// timing
unsigned long lastIRTime1 = 0;
unsigned long lastIRTime2 = 0;
const int debounceDelay = 500;

// -------------------------------
// ULTRASONIC READ (STABLE AVG)
// -------------------------------
float readDistance(int trig, int echo)
{
    float sum = 0;
    int valid = 0;

    for (int i = 0; i < 5; i++)
    {
        digitalWrite(trig, LOW);
        delayMicroseconds(2);

        digitalWrite(trig, HIGH);
        delayMicroseconds(10);
        digitalWrite(trig, LOW);

        long duration = pulseIn(echo, HIGH, 30000);
        float d = duration * 0.0343 / 2;

        if (d > 2 && d < 400)
        {
            sum += d;
            valid++;
        }

        delay(20);
    }

    if (valid < 2) return -1; // strict filter
    return sum / valid;
}

// -------------------------------
// DISTANCE → STOCK (SAFE MAPPING)
// -------------------------------
int distanceToStock(float d)
{
    float FULL = 4.0;
    float EMPTY = 20.0;

    if (d < 0) return -1;

    if (d <= FULL) return MAX_ITEMS;
    if (d >= EMPTY) return 0;

    float step = (EMPTY - FULL) / MAX_ITEMS;
    int val = MAX_ITEMS - ((d - FULL) / step);

    if (val < 0) val = 0;
    if (val > MAX_ITEMS) val = MAX_ITEMS;

    return val;
}

// -------------------------------
// STABILITY FILTER (KEY PART)
// -------------------------------
int stabilize(int newVal, int oldVal)
{
    if (newVal == -1) return oldVal;

    // ignore extreme jumps
    if (abs(newVal - oldVal) > 3)
        return oldVal;

    return newVal;
}

// -------------------------------
// SETUP
// -------------------------------
void setup()
{
    Serial.begin(115200);

    pinMode(IR1, INPUT);
    pinMode(IR2, INPUT);

    pinMode(TRIG1, OUTPUT);
    pinMode(ECHO1, INPUT);

    pinMode(TRIG2, OUTPUT);
    pinMode(ECHO2, INPUT);

    Serial.println("FINAL STABLE INVENTORY SYSTEM STARTED");
}

// -------------------------------
// LOOP
// -------------------------------
void loop()
{
    bool ir1 = digitalRead(IR1);
    bool ir2 = digitalRead(IR2);

    unsigned long now = millis();

    // =========================
    // LANE A (CONTINUOUS CONTROL)
    // =========================
    float dA = readDistance(TRIG1, ECHO1);
    int rawA = distanceToStock(dA);

    stockA = stabilize(rawA, stockA);

    // IR only helps correction (not mandatory)
    if (lastIR1 == HIGH && ir1 == LOW && (now - lastIRTime1 > debounceDelay))
    {
        if (rawA != -1)
            stockA = rawA;

        lastIRTime1 = now;
    }

    // =========================
    // LANE B
    // =========================
    float dB = readDistance(TRIG2, ECHO2);
    int rawB = distanceToStock(dB);

    stockB = stabilize(rawB, stockB);

    if (lastIR2 == HIGH && ir2 == LOW && (now - lastIRTime2 > debounceDelay))
    {
        if (rawB != -1)
            stockB = rawB;

        lastIRTime2 = now;
    }

    lastIR1 = ir1;
    lastIR2 = ir2;

    // =========================
    // FINAL OUTPUT
    // =========================
    int total = stockA + stockB;

    Serial.print("{\"laneA\":");
    Serial.print(stockA);

    Serial.print(",\"laneB\":");
    Serial.print(stockB);

    Serial.print(",\"total\":");
    Serial.print(total);
    

    Serial.print(",\"distA\":");
    Serial.print(dA);

    Serial.print(",\"distB\":");
    Serial.print(dB);

    Serial.println("}");

    delay(500);
}
import serial
import json
import time
from datetime import datetime

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

# ==========================================
# FIREBASE CONFIGURATION
# ==========================================

cred = credentials.Certificate("firebase_key.json")

firebase_admin.initialize_app(
    cred,
    {
        "databaseURL": "https://smartinventory-8b6e2-default-rtdb.asia-southeast1.firebasedatabase.app"
    }
)

print("===================================")
print("✅ Firebase Connected")
print("===================================")

# ==========================================
# ESP32 CONFIGURATION
# ==========================================

PORT = "COM5"
BAUD_RATE = 115200

print("Connecting to ESP32...")

try:
    esp32 = serial.Serial(PORT, BAUD_RATE, timeout=1)

    time.sleep(2)

    esp32.reset_input_buffer()

    print("✅ Connected to ESP32 on", PORT)

except Exception as e:

    print("Failed to connect!")
    print(e)
    exit()

print("===================================")

# ==========================================
# FIREBASE REFERENCES
# ==========================================

milkRef = db.reference("products/milk")
biscuitRef = db.reference("products/biscuits")

print("Waiting for ESP32 Data...\n")

# ==========================================
# MAIN LOOP
# ==========================================

while True:

    try:

        line = esp32.readline().decode("utf-8", errors="ignore").strip()

        if line == "":
            continue

        # Ignore ESP32 boot messages
        if not line.startswith("{"):
            continue

        print("RAW:", line)

        data = json.loads(line)

        laneA = int(data["laneA"])
        laneB = int(data["laneB"])
        total = int(data["total"])
        distA = float(data["distA"])
        distB = float(data["distB"])

        print("----------------------")
        print("Lane A :", laneA)
        print("Lane B :", laneB)
        print("Total  :", total)
        print("Dist A :", distA)
        print("Dist B :", distB)
        print("----------------------")

        # =====================================
        # Update Firebase
        # =====================================

        milkRef.set({

            "stock": laneA,
            "threshold": 5,
            "shelf": "A1",
            "lastUpdated": datetime.now().strftime("%H:%M:%S")

        })

        biscuitRef.set({

            "stock": laneB,
            "threshold": 5,
            "shelf": "A2",
            "lastUpdated": datetime.now().strftime("%H:%M:%S")

        })

        print("✅ Firebase Updated Successfully\n")

    except json.JSONDecodeError:

        print("Invalid JSON")

    except KeyboardInterrupt:

        print("Program Stopped")
        break

    except Exception as e:

        print("ERROR:", e)

        time.sleep(1)
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

cred = credentials.Certificate("firebase_key.json")

firebase_admin.initialize_app(
    cred,
    {
        "databaseURL": "https://smartinventory-8b6e2-default-rtdb.asia-southeast1.firebasedatabase.app"
    }
)

ref = db.reference("test")

ref.set({
    "message": "Hello from Python"
})

print("SUCCESS!")
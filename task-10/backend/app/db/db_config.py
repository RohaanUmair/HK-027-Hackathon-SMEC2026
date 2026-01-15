import firebase_admin
from firebase_admin import credentials
import os


current_dir = os.path.dirname(os.path.abspath(__file__))
service_account_path = os.path.join(current_dir, "reusex-13b84-firebase-adminsdk-fbsvc-5206463438.json")


cred = credentials.Certificate(service_account_path)
firebase_admin.initialize_app(cred)




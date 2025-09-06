import tkinter as tk
from tkinter import filedialog, messagebox
import threading
import time
import requests
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import os
import json

# Update the default URL here to the public one once it's available
API_URL = os.getenv("RK10_API_URL", "http://localhost:5000/api")
print(f"Using API URL: {API_URL}")
CONFIG_FILE = "agent_config.json"

class FolderChangeHandler(FileSystemEventHandler):
    def __init__(self):
        self.file_mtimes = {}
        self.api_token = None

    def on_modified(self, event):
        if not event.is_directory and event.src_path.lower().endswith('.tdf'):
            filepath = event.src_path
            mtime = os.path.getmtime(filepath)
            last_mtime = self.file_mtimes.get(filepath)
            if last_mtime != mtime:
                self.file_mtimes[filepath] = mtime
                print(f"Detected change in {filepath}, uploading...")
                try:
                    with open(filepath, 'rb') as f:
                        files = {'file': (os.path.basename(filepath), f, 'application/octet-stream')}
                        headers = {'Authorization': f'Bearer {self.api_token}'} if self.api_token else {}
                        response = requests.post(f"{API_URL}/upload-tdf", files=files, headers=headers)
                        print(f"Upload response: {response.status_code} {response.text}")
                except Exception as e:
                    print(f"Error uploading file: {e}")

def get_persisted_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r") as f:
                data = json.load(f)
                folder = data.get("folder_path")
                api_token = data.get("api_token")
                return folder, api_token
        except Exception:
            pass
    return None, None

def persist_config(folder_path, api_token):
    with open(CONFIG_FILE, "w") as f:
        json.dump({"folder_path": folder_path, "api_token": api_token}, f)

def select_folder_and_watch():
    folder_path, api_token = get_persisted_config()
    if not folder_path:
        root = tk.Tk()
        root.withdraw()
        folder_path = filedialog.askdirectory(title="Select TOM_DATA folder to Monitor")
        if not folder_path:
            messagebox.showinfo("No folder selected", "No folder was selected. Exiting.")
            return
    if not api_token:
        root = tk.Tk()
        root.withdraw()
        api_token = tk.simpledialog.askstring("API Token", "Enter your API token:")
        if not api_token:
            messagebox.showinfo("No token entered", "No API token was entered. Exiting.")
            return
    persist_config(folder_path, api_token)

    print(f"Monitoring folder: {folder_path}")
    event_handler = FolderChangeHandler()
    event_handler.api_token = api_token  # Pass token to handler
    observer = Observer()
    observer.schedule(event_handler, path=folder_path, recursive=False)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    select_folder_and_watch()
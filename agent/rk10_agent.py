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
API_URL = os.getenv("RK10_API_URL", "http://localhost:5000")
CONFIG_FILE = "agent_config.json"

class FolderChangeHandler(FileSystemEventHandler):
    def __init__(self):
        self.file_mtimes = {}

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
                        response = requests.post(f"{API_URL}/upload-tdf", files=files)
                        print(f"Upload response: {response.status_code} {response.text}")
                except Exception as e:
                    print(f"Error uploading file: {e}")

def get_persisted_folder():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r") as f:
                data = json.load(f)
                folder = data.get("folder_path")
                if folder and os.path.isdir(folder):
                    return folder
        except Exception:
            pass
    return None

def persist_folder(folder_path):
    with open(CONFIG_FILE, "w") as f:
        json.dump({"folder_path": folder_path}, f)

def select_folder_and_watch():
    folder_path = get_persisted_folder()
    if not folder_path:
        root = tk.Tk()
        root.withdraw()
        folder_path = filedialog.askdirectory(title="Select TOM_DATA folder to Monitor")
        if not folder_path:
            messagebox.showinfo("No folder selected", "No folder was selected. Exiting.")
            return
        persist_folder(folder_path)

    print(f"Monitoring folder: {folder_path}")
    event_handler = FolderChangeHandler()
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
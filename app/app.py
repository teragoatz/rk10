from flask import Flask, jsonify, request
import psycopg2
from datetime import datetime
import os
from werkzeug.utils import secure_filename
from models import Match, Round, Tournament
from tdf_ingest import TdfIngest
from repository import PostgresRepository

if os.getenv("DEBUG_ENABLED") == "1":
    import debugpy
    debugpy.listen(("0.0.0.0", 5678))
    print("Waiting for debugger attach...")
    # debugpy.wait_for_client()

app = Flask(__name__)

ALLOWED_EXTENSIONS = {'tdf'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload-tdf', methods=['POST'])
def upload_tdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_content = file.read().decode('utf-8')

        # Ingest the TDF data
        repo = PostgresRepository()
        ingest = TdfIngest(repo)
        ingest.ingest(file_content)

        return jsonify({"message": f"Received {filename}"}), 200
    else:
        return jsonify({"error": "Invalid file type. Only .tdf files are allowed."}), 400

@app.route('/tournament/<tournament_id>/pairings', methods=['GET'])
def get_tournament_pairings(tournament_id):
    repo = PostgresRepository()
    rounds = repo.list(Round, tournament_id=tournament_id)
    result = []
    for rnd in rounds:
        matches = repo.list(Match, round_id=rnd.id)
        round_dict = rnd.as_dict()
        round_dict["matches"] = [m.as_dict() for m in matches]
        result.append(round_dict)
    return jsonify(result)

@app.route('/tournament/<tournament_id>', methods=['GET'])
def get_tournament(tournament_id):
    repo = PostgresRepository()
    tournament = repo.get(Tournament, tournament_id)
    if not tournament:
        return jsonify({"error": "Tournament not found"}), 404
    return jsonify(tournament.as_dict())

@app.route('/tournaments', methods=['GET'])
def list_tournaments():
    status = request.args.get('status', 'all')
    repo = PostgresRepository()
    result = []

    if status == 'all':
        tournaments = repo.list(Tournament)
    elif status == 'finished':
        tournaments = repo.list(Tournament, is_finished=True)
    elif status == 'incomplete':
        tournaments = repo.list(Tournament, is_finished=False)
    else:
        tournaments = repo.list(Tournament)

    for t in tournaments:
        result.append(t.as_dict())

    return jsonify(result)

# Database connection
def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST"),
        database=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD")
    )

@app.route('/hello', methods=['GET'])
def hello_world():
    conn = get_db_connection()
    cur = conn.cursor()

    # Insert the current hit
    current_time = datetime.now()
    cur.execute("INSERT INTO hello_hits (hit_time) VALUES (%s)", (current_time,))
    conn.commit()

    # Get the hit count and last hit time
    cur.execute("SELECT COUNT(*) FROM hello_hits")
    hit_count = cur.fetchone()[0]

    cur.execute("SELECT hit_time FROM hello_hits ORDER BY id DESC LIMIT 1 OFFSET 1")
    last_hit = cur.fetchone()
    last_hit_time = last_hit[0] if last_hit else None

    cur.close()
    conn.close()

    return jsonify({
        "message": "Hello, World!",
        "hit_count": hit_count,
        "last_hit_time": last_hit_time,
        "current_hit_time": current_time
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
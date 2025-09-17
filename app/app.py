from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import psycopg2
from datetime import datetime
import eventlet
import os
from werkzeug.utils import secure_filename
from models import Match, Player, Round, Tournament
from tdf_ingest import TdfIngest
from repository import PostgresRepository

eventlet.monkey_patch()

if os.getenv("DEBUG_ENABLED") == "1":
    import debugpy
    debugpy.listen(("0.0.0.0", 5678))
    print("Waiting for debugger attach...")
    # debugpy.wait_for_client()

app = Flask(__name__)
socketio = SocketIO(app, async_mode="eventlet", cors_allowed_origins="*")  # Allow frontend connections

CLIENT_URL = os.getenv("RK10_CLIENT_URL", "http://localhost:3000")
CORS(app, resources={r"/*": {"origins": [CLIENT_URL]}})

ALLOWED_EXTENSIONS = {'tdf'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/update', methods=['POST'])
def update_data():
    # ... update logic ...
    socketio.emit('data_updated', {'message': 'Data has been updated'})
    return {'status': 'ok'}

@socketio.on('connect')
def handle_connect():
    print('Client connected', flush=True)

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected', flush=True)

@app.route('/api/upload-tdf', methods=['POST'])
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

        # Emit update event to frontend
        socketio.emit('data_updated', {'message': 'Data has been updated'})

        return jsonify({"message": f"Received {filename}"}), 200
    else:
        return jsonify({"error": "Invalid file type. Only .tdf files are allowed."}), 400

@app.route('/api/tournament/<tournament_id>/pairings', methods=['GET'])
def get_tournament_pairings(tournament_id):
    repo = PostgresRepository()
    rounds = repo.list(Round, tournament_id=tournament_id)
    result = []
    for rnd in rounds:
        matches = repo.list(Match, round_id=rnd.id)
        match_list = []
        for m in matches:
            player1 = repo.get(Player, m.player1_id) if m.player1_id else None
            player2 = repo.get(Player, m.player2_id) if m.player2_id else None
            match_dict = m.as_dict()
            match_dict["player1_name"] = {
                "first": player1.firstname,
                "last": player1.lastname
            } if player1 and player1.tc_consent else None
            match_dict["player2_name"] = {
                "first": player2.firstname,
                "last": player2.lastname
            } if player2 and player2.tc_consent else None
            match_list.append(match_dict)
        round_dict = rnd.as_dict()
        round_dict["matches"] = match_list
        result.append(round_dict)
    return jsonify(result)

# Endpoint to get tournament standings
@app.route('/api/tournament/<tournament_id>/standings', methods=['GET'])
def get_tournament_standings(tournament_id):
    repo = PostgresRepository()
    standings = repo.get_tournament_standings(tournament_id)
    return jsonify(standings)

@app.route('/api/tournament/<tournament_id>', methods=['GET'])
def get_tournament(tournament_id):
    repo = PostgresRepository()
    tournament = repo.get(Tournament, tournament_id)
    if not tournament:
        return jsonify({"error": "Tournament not found"}), 404
    return jsonify(tournament.as_dict())

@app.route('/api/tournaments', methods=['GET'])
def list_tournaments():
    status = request.args.get('status', 'all')
    repo = PostgresRepository()
    result = []

    if status == 'finished':
        tournaments = repo.list(Tournament, is_finished=True)
    elif status == 'incomplete':
        tournaments = repo.list(Tournament, is_finished=False)
    else:
        tournaments = repo.list(Tournament)

    for t in tournaments:
        result.append(t.as_dict())

    return jsonify(result)

@app.route('/api/player/<player_id>/consent', methods=['POST'])
def set_player_consent(player_id):
    data = request.get_json()
    consent = data.get('consent', False)  # Default to False if not provided
    repo = PostgresRepository()
    player = repo.set_player_consent(player_id, consent=bool(consent))
    return jsonify({"message": f"Updated consent for {player_id}"}), 200

@app.route('/api/match/<int:match_id>/select-outcome', methods=['POST'])
def select_match_outcome(match_id):
    data = request.get_json()
    player_id = data.get('player_id')
    outcome = data.get('outcome')
    if not player_id or outcome is None:
        return jsonify({"error": "player_id and outcome required"}), 400

    repo = PostgresRepository()
    try:
        both_agree, agreed_outcome = repo.select_match_outcome(match_id, player_id, outcome)
        if both_agree:
            # Emit update event to frontend
            socketio.emit('data_updated', {'message': 'Data has been updated'})

            return jsonify({"message": "Outcome set!", "outcome": agreed_outcome}), 200
        else:
            return jsonify({"message": "Selection recorded. Waiting for other player."}), 202
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
    socketio.run(app, host='0.0.0.0', port=5000)
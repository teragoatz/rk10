from flask import Flask, jsonify
import psycopg2
from datetime import datetime
import os

app = Flask(__name__)

# Database connection
def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST", "db"),
        database=os.getenv("POSTGRES_DB", "hello_world"),
        user=os.getenv("POSTGRES_USER", "postgres"),
        password=os.getenv("POSTGRES_PASSWORD", "postgres")
    )

@app.route('/hello', methods=['GET'])
def hello_world():
    conn = get_db_connection()
    cur = conn.cursor()

    # Insert the current hit
    current_time = datetime.now()
    cur.execute("INSERT INTO hits (hit_time) VALUES (%s)", (current_time,))
    conn.commit()

    # Get the hit count and last hit time
    cur.execute("SELECT COUNT(*) FROM hits")
    hit_count = cur.fetchone()[0]

    cur.execute("SELECT hit_time FROM hits ORDER BY id DESC LIMIT 1 OFFSET 1")
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
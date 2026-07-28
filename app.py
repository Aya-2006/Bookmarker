import sqlite3
from datetime import datetime
from pathlib import Path

from flask import Flask, g, render_template, request, jsonify

BASE_DIR = Path(__file__).resolve().parent
DATABASE = BASE_DIR / "bookmarks.db"
SCHEMA = BASE_DIR / "schema.sql"

app = Flask(__name__)


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(exception=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    with app.app_context():
        db = get_db()
        with open(SCHEMA, "r") as f:
            db.executescript(f.read())
        db.commit()


@app.route("/")
def index():
    return render_template("index.html")


# ---------- JSON API used by static/js/main.js ----------

@app.route("/api/bookmarks", methods=["GET"])
def get_bookmarks():
    db = get_db()
    rows = db.execute("SELECT id, name, url FROM bookmarks ORDER BY id").fetchall()
    return jsonify([dict(row) for row in rows])


@app.route("/api/bookmarks", methods=["POST"])
def add_bookmark():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    url = (data.get("url") or "").strip()

    if len(name) < 3 or not url:
        return jsonify({"error": "invalid name or url"}), 400

    db = get_db()
    db.execute(
        "INSERT INTO bookmarks (name, url, created_at) VALUES (?, ?, ?)",
        (name, url, datetime.now().strftime("%Y-%m-%d %H:%M")),
    )
    db.commit()
    return jsonify({"ok": True}), 201


@app.route("/api/bookmarks/<int:bookmark_id>", methods=["PUT"])
def update_bookmark(bookmark_id):
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    url = (data.get("url") or "").strip()

    if len(name) < 3 or not url:
        return jsonify({"error": "invalid name or url"}), 400

    db = get_db()
    db.execute(
        "UPDATE bookmarks SET name = ?, url = ? WHERE id = ?",
        (name, url, bookmark_id),
    )
    db.commit()
    return jsonify({"ok": True})


@app.route("/api/bookmarks/<int:bookmark_id>", methods=["DELETE"])
def delete_bookmark(bookmark_id):
    db = get_db()
    db.execute("DELETE FROM bookmarks WHERE id = ?", (bookmark_id,))
    db.commit()
    return jsonify({"ok": True})


if __name__ == "__main__":
    if not DATABASE.exists():
        init_db()
    app.run(debug=True, port=5000)

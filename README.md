# Bookmarker

A simple web application built with **Flask** and **SQLite** to save and manage bookmarks.

## Features

- Add a new bookmark
- View all saved bookmarks
- Delete bookmarks
- Data is stored in SQLite database
- Simple and responsive interface

## Technologies Used

- Python
- Flask
- SQLite
- HTML
- CSS
- JavaScript

## Project Structure

```
bookmarker/
│── app.py
│── schema.sql
│── bookmarks.db
│── requirements.txt
│── templates/
│── static/
```

## Installation

1. Clone the repository

```bash
git clone <repository-url>
```

2. Go to the project folder

```bash
cd bookmarker
```

3. Install the required packages

```bash
pip install -r requirements.txt
```

4. Run the application

```bash
python app.py
```

5. Open your browser and visit

```
http://127.0.0.1:5000
```

## Database

The project uses **SQLite**.

The `bookmarks` table contains:

- id
- name
- url
- created_at

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/bookmarks` | Get all bookmarks |
| POST | `/api/bookmarks` | Add a new bookmark |
| DELETE | `/api/bookmarks/<id>` | Delete a bookmark |

## Future Improvements

- Edit bookmarks
- Search functionality
- Categories
- User authentication
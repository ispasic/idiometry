# idiometry: an idiom search engine
A Flask-React project for serving the user interface and pre/post processing of idiom specific searches to an Elasticsearch database. A demo is available here: https://datainnovation.cardiff.ac.uk/idiometry/

## Set Up
The following will install the packages according to the configuration:
#### `pip install -r requirements.txt`

## Run the Project
To run the Flask server (from parent directory):
#### `export FLASK_APP=flask-backend/app.py`
#### `flask run`

If you're using an IDE like pycharm it may also be worth marking the `flask-backend` directory as the sources route so that relative imports are interpreted properly.

## Test Processing Functions
To run tests relating to the processing functions:
#### `cd flask-backend`
#### `pytest`

## Modify the Front-End
First make sure node dependencies are installed:
#### `cd react-frontend`
#### `yarn install`

Modifications to the front end can be applied by running a build within the `react-frontend` directory:
#### `npm run build`
This will update the static files in the `flask-backend` directory.

## Files of Interest
Main app HTTP functions: `flask-backend/app.py`

The individual back-end processing functions: `flask-backend/static/python/process_functions.py`

Tests for individual back-end processing functions: `flask-backend/static/python/test_process_functions.py`

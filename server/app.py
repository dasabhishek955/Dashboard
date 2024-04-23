from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
import mysql.connector
from datetime import datetime

app = Flask(__name__)
cors = CORS(app)

# Configure MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'dashboard'

mysql = MySQL(app)


@app.route('/upload-data', methods=['POST'])
def upload_data():
    try:
        data = request.get_json()
        id_no = data['Item_ID']
        name = data['name']
        date = data['date']
        weight = data['weight']
        cost = data['cost']

        # Create a cursor and execute the SQL query
        cur = mysql.connection.cursor()
        cur.execute(
            "INSERT INTO data1 (item_ID, Name, Date, Weight, Cost) VALUES (%s, %s, %s,  %s, %s)",
            (id_no, name, date, weight, cost)
        )

        # Commit the transaction
        mysql.connection.commit()

        # Close the cursor
        cur.close()
        return jsonify({"message": "Data uploaded successfully"}), 200

    except Exception as e:
        print(str(e))
        return jsonify({"error": "Failed to upload data"}), 500


@app.route('/fetch-data', methods=['GET'])
def fetch_data():

    try:

        date_str = request.args.get('date', '')
        cur = mysql.connection.cursor()

        if date_str:
            # If date parameter is provided, perform search-by-date
            date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
            cur.execute("SELECT * FROM data1 WHERE date = %s", (date_obj,))
            data = cur.fetchall()
            cur.close()
        else:
            # If date parameter is not provided, perform regular fetch
            cur.execute("SELECT * FROM data1")
            data = cur.fetchall()
            cur.close()

        result = [
            {'id': row[1], 'name': row[2], 'date': row[3],
                'weight': row[4], 'cost': row[5]}
            for row in data
        ]
        return jsonify(result), 200

    except Exception as e:
        print(str(e))
        return jsonify({"error": "Failed to fetch data"}), 500


@app.route('/delete-data/<int:data_id>', methods=['DELETE'])
def delete_data(data_id):
    try:
        # Create a cursor and execute the SQL query
        cur = mysql.connection.cursor()
        print(data_id)
        cur.execute("DELETE FROM data1 WHERE item_ID = %s", (data_id,))

        # Commit the transaction
        mysql.connection.commit()

        # Close the cursor
        cur.close()
        return jsonify({"message": "Data deleted successfully"}), 200

    except Exception as e:
        print(str(e))
        return jsonify({"error": "Failed to delete data"}), 500


@app.route('/edit-data/<int:data_id>', methods=['PUT'])
def edit_data(data_id):
    try:
        # Get the data to be edited from the request body
        data_to_edit = request.json

        # Create a cursor and execute the SQL query
        cur = mysql.connection.cursor()
        cur.execute("""
            UPDATE data1
            SET name = %s, date = %s,  weight = %s, cost = %s
            WHERE item_ID = %s
        """, (data_to_edit['name'], data_to_edit['date'],  data_to_edit['weight'], data_to_edit['cost'], data_id))

        # Commit the transaction
        mysql.connection.commit()

        # Close the cursor
        cur.close()

        return jsonify({"message": "Data edited successfully"}), 200

    except Exception as e:
        print(str(e))
        return jsonify({"error": "Failed to edit data"}), 500


@app.route('/total-cost', methods=['GET'])
def get_total_cost():
    try:
        # Create a cursor and execute the SQL query to get the total cost
        cur = mysql.connection.cursor()
        cur.execute("SELECT SUM(cost) FROM data1")
        total_cost = cur.fetchone()[0] or 0

        # Close the cursor
        cur.close()
        return jsonify({"totalCost": total_cost}), 200

    except Exception as e:
        print(str(e))
        return jsonify({"error": "Failed to get total cost"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5004)

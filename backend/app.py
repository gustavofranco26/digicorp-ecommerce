from flask import Flask, jsonify
from flask_cors import CORS
from db import get_connection

app = Flask(__name__)
CORS(app)

@app.route('/api/products')
def get_products():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(products)

if __name__ == '__main__':
    app.run(debug=True)
    try:
        conn = get_connection()
        print("Conexión a la base de datos exitosa")
        conn.close()
    except Exception as e:
        print("Error al conectar con la base de datos:", e)

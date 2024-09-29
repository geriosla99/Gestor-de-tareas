from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

tasks = []  # Puedes almacenar las tareas en una lista para probar

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

@app.route('/add_task', methods=['POST'])
def add_task():
    data = request.get_json()
    tasks.append({'id': len(tasks) + 1, 'name': data['task']})
    return jsonify(success=True)

@app.route('/delete_task/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task['id'] != task_id]
    return jsonify(success=True)

@app.route('/edit_task/<int:task_id>', methods=['PUT'])
def edit_task(task_id):
    data = request.json
    for task in tasks:
        if task['id'] == task_id:
            task['name'] = data['task']
            return jsonify(task), 200  # Asegúrate de devolver un código 200
    return '', 404  # Si no se encuentra la tarea

if __name__ == '__main__':
    app.run(debug=True)

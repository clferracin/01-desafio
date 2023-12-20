import moment from 'moment'
import { Database }  from './database.js'
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query
      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)
      return res
        .end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body
      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: moment().format('YYYY/MM/D hh:mm:ss SSS'),
        updated_at: moment().format('YYYY/MM/D hh:mm:ss SSS'),
        completed_at: ""
      } 
    
      database.insert('tasks', task)
    
      return res
        .writeHead(201)
        .end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body
      const updated_at = moment().format('YYYY/MM/D hh:mm:ss SSS')

      if (!title && !description) {
        return res.writeHead(400).end(JSON.stringify({message: 'Title or description are required!'}));
      }

      const [task] = database.select('tasks', { id });
      console.log(task);
      if (!task) {
        return res.writeHead(404).end(JSON.stringify({message: 'Id not found!'}));
      }

      if (title && !description) {
        database.update('tasks', id, { title, updated_at });
      } else if(!title && description) {
        database.update('tasks', id, { description, updated_at });
      }

      
      return res
        .writeHead(204)
        .end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params


      const [task] = database.select('tasks', { id });
      
      if (!task) {
        return res.writeHead(404).end(JSON.stringify({message: 'Id not found!'}));
      }

      if (task.completed_at) {
        task.completed_at = null;
      } else {
        task.completed_at = new Date();
      }
      database.patch('tasks', id, task);

      
      return res
        .writeHead(200)
        .end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const [task] = database.select('tasks', { id });

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({message: 'Id not found!'}));
      }

      database.delete('tasks', id)

      return res
        .writeHead(200)
        .end()
    },
  }
]
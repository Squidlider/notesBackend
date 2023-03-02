const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()

const Note = require('./models/note')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

let notes = []

app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then((note) => {
    response.json(note)
  })
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter((note) => note.id !== id)
  response.status(204).end()
})

app.put('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find((note) => note.id === id)

  if (!note) {
    return response.status(404).json({
      error: 'note not found',
    })
  }

  const body = request.body
  const updatedNote = {
    ...note,
    content: body.content || note.content,
    important: body.important,
  }

  notes = notes.map((note) => (note.id !== id ? note : updatedNote))

  response.json(updatedNote)
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then((savedNote) => {
    response.json(savedNote)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

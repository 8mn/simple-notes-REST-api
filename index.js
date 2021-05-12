require('dotenv').config()
const express = require('express');
const app = express()
const cors = require('cors')


const Note = require('./models/note')


app.use(express.static('build'))
app.use(express.json(),cors())




// let notes = [  
//     {    
//         id: 1,
//         content: "HTML is easy",   
//         date: "2019-05-30T17:30:31.098Z",    
//         important: true  
//     },

//     {   id: 2,    
//         content: "Browser can execute only Javascript",    
//         date: "2019-05-30T18:39:34.091Z",    
//         important: false  
//     },  
    
//     {    
//         id: 3,    
//         content: "GET and POST are the most important methods of HTTP protocol",    
//         date: "2019-05-30T19:20:14.298Z",    
//         important: true  
//     }
// ]



app.get('/',(req,res) => {
    res.send('<h1>Hello express</h1>')
})

app.get('/api/notes',(req,res) => {
    Note.find({}).then(notes => {
        res.json(notes)
    })
})

app.get('/api/notes/:id',(req,res,next) => {
   Note.findById(req.params.id).then(note => {
       if(note){
           res.json(note)
       }else{
           res.status(404).end()
       }
   })
   .catch(error => next(error))
})

// app.patch('/api/notes/:id',(req,res) => {
//     const id = Number(req.params.id)
// })

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })
// const generateId = () => {
//     const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     :0
//     return maxId + 1

// }



app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body
    const note = {
      content: body.content,
      important: body.important,
    }
  
    Note.findByIdAndUpdate(request.params.id, note, { new: true })
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
  })



app.post('/api/notes',(req,res) => {
    const body = req.body

    if(body.content === undefined){
        return res.status(400).json({
            error:'content missing'
        })
    }

    const note = new Note({
        content:body.content,
        important:body.important || false,
        date: new Date(),
    })
    note.save().then(savedNote => {
        res.json(savedNote)
    })

    res.json(note)
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  // handler of requests with unknown endpoint
  app.use(unknownEndpoint)



const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }

  app.use(errorHandler)


const PORT = process.env.PORT || 3001

app.listen(PORT,"0.0.0.0",() => {
    console.log(`server running at port ${PORT}`)
})


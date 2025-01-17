const express = require("express")
const cors = require("cors")

const { uuid } = require("uuidv4")

const app = express()

app.use(express.json())
app.use(cors())

const repositories = []

app.get("/repositories", (request, response) => {
  return response.json(repositories)
})

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body

  const repo = {
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0
  }

  repositories.push(repo)

  return response.json(repo)
});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs} = request.body
  const {id} = request.params
  
  const repoIdx = repositories.findIndex(repo => repo.id === id)
  if (repoIdx < 0) {
    return response.status(400).json({error: "Invalid Repository Id."})
  }

  const repo = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIdx].likes
  }

  repositories[repoIdx] = repo

  return response.json(repo)
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params
  
  const repoIdx = repositories.findIndex(repo => repo.id === id)
  if (repoIdx < 0) {
    return response.status(400).json({error: "Invalid Repository Id."})
  }

  repositories.splice(repoIdx, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params
  
  const repoIdx = repositories.findIndex(repo => repo.id === id)
  if (repoIdx < 0) {
    return response.status(400).json({error: "Invalid Repository Id."})
  }

  const {title, url, techs, likes} = repositories[repoIdx]
  const newLikes = likes+1

  const repo = {
    id,
    title,
    url,
    techs,
    likes: newLikes
  }

  repositories[repoIdx] = repo

  return response.send({likes: newLikes})
});

module.exports = app

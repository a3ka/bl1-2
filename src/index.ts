//const express = require('express')
import express, {Request, Response} from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const bloggers = [
    {id: 1, name: 'Alex', youtubeUrl: 'https://www.alex.com'},
    {id: 2, name: 'Sasha', youtubeUrl: 'https://www.sasha.com'},
    {id: 3, name: 'Serg', youtubeUrl: 'https://www.serg.com'},
    {id: 4, name: 'Masha', youtubeUrl: 'https://www.masha.com'},
    {id: 5, name: 'Lena', youtubeUrl: 'https://www.lena.com'},
]


const app = express()
app.use(cors())
app.use(bodyParser())

const port = process.env.PORT || 5000

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
})

app.get('/bloggers', (req: Request, res: Response) => {
    res.status(200).send(bloggers);
})

app.get('/bloggers/:bloggerId', (req: Request, res: Response) => {

    const blogger = bloggers.find(b => b.id === +req.params.bloggerId);

    if (blogger) {
        res.status(200).send(blogger);
    } else {
        res.send(404);
    }
})


app.post('/bloggers', (req: Request, res: Response) => {

    let name = req.body.name
    let youtubeUrl= req.body.youtubeUrl
    let pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
    let youtubeUrlChecked = pattern.test(req.body.youtubeUrl.value)

    if (!name || typeof name !== 'string' || typeof youtubeUrl !== 'string' || !name.trim() ||  name.length > 15
        || youtubeUrl.length > 100 || youtubeUrlChecked === false) {
        res.status(400).send({
            "errorsMessages": [
                {
                    "message": "message",
                    "field": "message"
                }
            ]
        })
        return;
    } else {
        const newBlogger = {
            id: +(new Date()),
            name: req.body.name,
            youtubeUrl: req.body.youtubeUrl
        }
        bloggers.push(newBlogger)
        res.status(201).send(newBlogger)
    }
})

app.delete('/bloggers/:bloggerId', (req: Request, res: Response) => {

    for (let i = 0; i < bloggers.length; i++) {
        if (bloggers[i].id === +req.params.bloggerId) {
            bloggers.splice(i, 1);
            res.send(204)
            return;
        }
    }

    res.send(404)
})


app.put('/bloggers/:bloggerId', (req: Request, res: Response) => {

    let name = req.body.name
    let youtubeUrl= req.body.youtubeUrl
    let pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
    let youtubeUrlChecked = pattern.test(req.body.youtubeUrl.value)

    if (!name || typeof name !== 'string' || typeof youtubeUrl !== 'string' || !name.trim() ||  name.length > 15
        || youtubeUrl.length > 100 || youtubeUrlChecked === false) {
        res.status(400).send({
            "errorsMessages": [
                {
                    "message": "message",
                    "field": "message"
                }
            ]
        })
        return;

    } else {

        const video = bloggers.find(b => b.id === +req.params.bloggerId);

        if (video) {
            video.name = req.body.name
            video.youtubeUrl = req.body.youtubeUrl
            // res.status(204).send(video);
            res.send(204);
        } else {
            res.send(404)
        }
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


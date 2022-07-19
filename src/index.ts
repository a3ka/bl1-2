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

const posts:PostType[] = [
    {
        id: 1,
        title: '1st Post',
        shortDescription: 'Description of 1st post',
        content: 'Content of 1st Post',
        bloggerId: 1,
        bloggerName: 'Alex'
    },
    {
        id: 2,
        title: '2nd Post',
        shortDescription: 'Description of 2 post',
        content: 'Content of 2 Post',
        bloggerId: 2,
        bloggerName: 'Sasha'
    },
    {
        id: 3,
        title: '3 Post',
        shortDescription: 'Description of 3 post',
        content: 'Content of 3 Post',
        bloggerId: 3,
        bloggerName: 'Serg'
    },
    {
        id: 4,
        title: '4s Post',
        shortDescription: 'Description of 4 post',
        content: 'Content of 4 Post',
        bloggerId: 4,
        bloggerName: 'Masha'
    },
    {
        id: 5,
        title: '5s Post',
        shortDescription: 'Description of 5 post',
        content: 'Content of 5 Post',
        bloggerId: 5,
        bloggerName: 'Lena'
    },
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
    let youtubeUrl = req.body.youtubeUrl
    let pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
    let youtubeUrlChecked = pattern.test(youtubeUrl)
    let nameErrors = !name || typeof name !== 'string' || !name.trim() || name.length > 15
    let youtubeUrlErrors = typeof youtubeUrl !== 'string' || youtubeUrl.length > 100 || youtubeUrlChecked === false

    if (nameErrors || youtubeUrlErrors) {

        let errorsMessages = {errorsMessages: []}

        if (nameErrors) {
            // @ts-ignore
            errorsMessages.errorsMessages.push({message: "Problem with a Name field", field: "name"})
        }

        if (youtubeUrlErrors) {
            // @ts-ignore
            errorsMessages.errorsMessages.push({message: "Problem with a YoutubeUrl field", field: "youtubeUrl"})
        }

        res.status(400).send(errorsMessages)
        return;

    } else {
        const newBlogger = {
            id: +(new Date()),
            name: name,
            youtubeUrl: youtubeUrl
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
    let youtubeUrl = req.body.youtubeUrl
    let pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
    let youtubeUrlChecked = pattern.test(youtubeUrl)

    let nameErrors = !name || typeof name !== 'string' || !name.trim() || name.length > 15
    let youtubeUrlErrors = typeof youtubeUrl !== 'string' || youtubeUrl.length > 100 || youtubeUrlChecked === false

    if (nameErrors || youtubeUrlErrors) {

        let errorsMessages = {errorsMessages: []}

        if (nameErrors) {
            // @ts-ignore
            errorsMessages.errorsMessages.push({message: "Problem with a Name field", field: "name"})
        }

        if (youtubeUrlErrors) {
            // @ts-ignore
            errorsMessages.errorsMessages.push({message: "Problem with a YoutubeUrl field", field: "youtubeUrl"})
        }

        res.status(400).send(errorsMessages)
        return;

    } else {

        const video = bloggers.find(b => b.id === +req.params.bloggerId);

        if (video) {
            video.name = req.body.name
            video.youtubeUrl = req.body.youtubeUrl
            res.status(204).send(video);
            // res.send(204);
        } else {
            res.send(404)
        }
    }
})


/// POSTS !!!!!-----------------------------------------------------------------------------


const postMapper = (posts:PostType[] ) => {
    return posts.map(el => {
        const post:Omit<PostType, 'bloggerName'> = {
            id: el.id,
            content: el.content,
            bloggerId: el.bloggerId,
            title: el.title,
            shortDescription: el.shortDescription
        }
        return post
    })
}



app.get('/posts', (req: Request, res: Response) => {
    // res.status(200).send(postMapper(posts));
    res.status(200).send(posts);
})

app.get('/posts/:postId', (req: Request, res: Response) => {

    if (typeof +req.params.postId !== "number") {
        res.send(400);
        return;
    }

    const post = posts.find(p => p.id === +req.params.postId);

    // @ts-ignore
    delete post.bloggerName

    if (post) {
        // res.status(200).send(post);
        res.status(200).send(post);
    } else {
        res.send(404);
    }
})


app.post('/posts', (req: Request, res: Response) => {

    let title = req.body.title
    let shortDescription = req.body.shortDescription
    let content = req.body.content
    let bloggerId = req.body.bloggerId

    let titleErrors = !title || typeof title !== 'string' || title.trim().length === 0 || title.trim().length > 30
    let shortDescriptionErrors = !shortDescription || typeof shortDescription !== 'string' || shortDescription.length > 100
    let contentErrors = !content || typeof content !== 'string' || content.trim().length === 0 || content.trim().length > 1000
    let bloggerIdErrors = !bloggerId || typeof bloggerId !== "number"

    let errorsMessages: ErrorResponseType = { errorsMessages: [] }

    if (titleErrors || shortDescriptionErrors || contentErrors || bloggerIdErrors) {

        if (titleErrors) {
            errorsMessages.errorsMessages.push({message: "Problem with a Title field", field: "title"})
        }

        if (shortDescriptionErrors) {
            errorsMessages.errorsMessages.push({message: "Problem with a shortDescription field",  field: "shortDescription" })
        }

        if (contentErrors) {
            errorsMessages.errorsMessages.push({message: "Problem with a Content field", field: "content"})
        }

        if (bloggerIdErrors) {
            errorsMessages.errorsMessages.push({message: "Problem with a BloggerId field", field: "bloggerId"})
        }

        res.status(400).send(errorsMessages)
        return;

    } else {
        const blogger = bloggers.find(b => b.id === +bloggerId);
        if (blogger) {
            const newPost = {
                id: +(new Date()),
                title,
                shortDescription,
                content,
                bloggerId,
            }

            posts.push({...newPost, bloggerName: blogger.name})
            res.status(201).send(newPost)
        } else {
            errorsMessages.errorsMessages.push({message: "Blogger not found", field: "bloggerId"})
            res.status(400).send(errorsMessages)
        }
    }
})

app.delete('/posts/:postId', (req: Request, res: Response) => {

    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === +req.params.postId) {
            posts.splice(i, 1);
            res.send(204)
            return;
        }
    }

    res.send(404)
})

app.put('/posts/:postId', (req: Request, res: Response) => {

    let title = req.body.title
    let shortDescription = req.body.shortDescription
    let content = req.body.content
    let bloggerId = req.body.bloggerId

    let titleErrors = !title || typeof title !== 'string' || title.trim().length === 0 || title.trim().length > 30
    let shortDescriptionErrors = !shortDescription || typeof shortDescription !== 'string' || shortDescription.length > 100
    let contentErrors = !content || typeof content !== 'string' || content.trim().length === 0 || content.trim().length > 1000
    let bloggerIdErrors = !bloggerId || typeof bloggerId !== "number"

    const blogPost = posts.find(p => p.id === +req.params.postId);
    // @ts-ignore
    const blogger = bloggers.find(b => b.id === +blogPost.bloggerId);


    if (titleErrors || shortDescriptionErrors || contentErrors || bloggerIdErrors ) {

        let errorsMessages: ErrorResponseType = { errorsMessages: [] }

        if (titleErrors) {
            errorsMessages.errorsMessages.push({message: "Problem with a Title field", field: "title"})
        }

        if (shortDescriptionErrors) {
            errorsMessages.errorsMessages.push({message: "Problem with a shortDescription field", field: "shortDescription"})
        }

        if (contentErrors) {
            errorsMessages.errorsMessages.push({message: "Problem with a Content field", field: "content"})
        }

        if (bloggerIdErrors || blogger) {
            errorsMessages.errorsMessages.push({message: "Problem with a BloggerId field", field: "bloggerId"})
        }

        res.status(400).send(errorsMessages)
        return;

    } else {

        if (blogPost) {
            blogPost.title = title
            blogPost.shortDescription = shortDescription
            blogPost.content = content
            blogPost.bloggerId = bloggerId
            // blogPost.bloggerName = blogPost.bloggerName
            res.status(204).send(blogPost);
            // res.send(204);
        } else {
            res.send(404)
        }
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


type ErrorsMessagesType = {
    message: string
    field: string | null
}

type PostType = {
    id: number
    title: string
    shortDescription: string
    content: string
    bloggerId: number
    bloggerName: string
}

type ErrorResponseType = { errorsMessages:ErrorsMessagesType[] }



import {Request, Response, Router} from "express";

const bloggers = [
    {id: 1, name: 'Alex', youtubeUrl: 'https://www.alex.com'},
    {id: 2, name: 'Sasha', youtubeUrl: 'https://www.sasha.com'},
    {id: 3, name: 'Serg', youtubeUrl: 'https://www.serg.com'},
    {id: 4, name: 'Masha', youtubeUrl: 'https://www.masha.com'},
    {id: 5, name: 'Lena', youtubeUrl: 'https://www.lena.com'},
]

export const bloggersRouter = Router({})

// bloggersRouter.get('/', (req: Request, res: Response) => {
//     res.send('Hello World!');
// })

bloggersRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(bloggers);
})

bloggersRouter.post('/', (req: Request, res: Response) => {

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

bloggersRouter.get('/:bloggerId', (req: Request, res: Response) => {

    const blogger = bloggers.find(b => b.id === +req.params.bloggerId);

    if (blogger) {
        res.status(200).send(blogger);
    } else {
        res.send(404);
    }
})

bloggersRouter.delete('/:bloggerId', (req: Request, res: Response) => {

    for (let i = 0; i < bloggers.length; i++) {
        if (bloggers[i].id === +req.params.bloggerId) {
            bloggers.splice(i, 1);
            res.send(204)
            return;
        }
    }

    res.send(404)
})

bloggersRouter.put('/:bloggerId', (req: Request, res: Response) => {

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


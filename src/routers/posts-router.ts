import {Request, Response, Router} from "express";

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

export const postsRouter = Router({});


postsRouter.get('/', (req: Request, res: Response) => {
    // res.status(200).send(postMapper(posts));
    res.status(200).send(posts);
})

postsRouter.post('/', (req: Request, res: Response) => {

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
                bloggerName: blogger.name
            }

            posts.push(newPost)
            res.status(201).send(newPost)
        } else {
            errorsMessages.errorsMessages.push({message: "Blogger not found", field: "bloggerId"})
            res.status(400).send(errorsMessages)
        }
    }
})

postsRouter.get('/:postId', (req: Request, res: Response) => {

    if (typeof +req.params.postId !== "number") {
        res.send(400);
        return;
    }

    const post = posts.find(p => p.id === +req.params.postId);
    // const post = []
    // post.push(posts.find(p => p.id === +req.params.postId))

    // @ts-ignore
    // delete post.bloggerName

    if (post) {
        // res.status(200).send(post);
        res.status(200).send(post);
    } else {
        res.send(404);
    }
})

postsRouter.delete('/:postId', (req: Request, res: Response) => {

    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === +req.params.postId) {
            posts.splice(i, 1);
            res.send(204)
            return;
        }
    }

    res.send(404)
})

postsRouter.put('/:postId', (req: Request, res: Response) => {

    let title = req.body.title
    let shortDescription = req.body.shortDescription
    let content = req.body.content
    let bloggerId = req.body.bloggerId

    let titleErrors = !title || typeof title !== 'string' || title.trim().length === 0 || title.trim().length > 30
    let shortDescriptionErrors = !shortDescription || typeof shortDescription !== 'string' || shortDescription.length > 100
    let contentErrors = !content || typeof content !== 'string' || content.trim().length === 0 || content.trim().length > 1000
    let bloggerIdErrors = !bloggerId || typeof bloggerId !== "number"

    // const blogPost = posts.find(p => p.id === +req.params.postId);
    const blogger = bloggers.find(b => b.id === bloggerId);
    // console.log(blogger)
    if (titleErrors || shortDescriptionErrors || contentErrors || bloggerIdErrors || !blogger ) {

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

        if (bloggerIdErrors || !blogger) {
            errorsMessages.errorsMessages.push({message: "Problem with a BloggerId field", field: "bloggerId"})
        }

        res.status(400).send(errorsMessages)
        return;

    } else {

        const blogPost = posts.find(p => p.id === +req.params.postId);
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


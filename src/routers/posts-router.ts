import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/auth-middleware";
import {bloggerIdExistenceValidationMiddleware} from "../middlewares/bloggerIdExistence-validation-middleware";


export const postsRouter = Router({});

const titleValidation = body('title').trim().isLength({min: 1, max: 30}).isString()
const shortDescriptionValidation = body('shortDescription').trim().isLength({min: 1, max: 100}).isString()
const contentValidation = body('content').trim().isLength({min: 1, max: 1000}).isString()
const bloggerIdValidation = body('bloggerId').isNumeric()


postsRouter.get('/', (req: Request, res: Response) => {
    const posts = postsRepository.getAllPosts()
    res.status(200).send(posts);
})

postsRouter.post('/',
    authMiddleware,
    // bloggerIdExistenceValidationMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {
        const newPost = postsRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)
        res.status(201).send(newPost)
    })

postsRouter.put('/:postId',
    authMiddleware,
    bloggerIdExistenceValidationMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {

        const isUpdated = postsRepository.updatePost(+req.params.postId, req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)

        if (isUpdated) {
            const blogPost = postsRepository.getPostById(+req.params.postId)
            res.status(204).send(blogPost);
            // res.send(204);
        } else {
            res.send(404)
        }
    })

postsRouter.get('/:postId', (req: Request, res: Response) => {

    if (typeof +req.params.postId !== "number") {
        res.send(400);
        return;
    }

    const post = postsRepository.getPostById(+req.params.postId)

    if (post) {
        res.status(200).send(post);
    } else {
        res.send(404);
    }
})

postsRouter.delete('/:postId', authMiddleware, (req: Request, res: Response) => {

    const isDeleted = postsRepository.deletePost(+req.params.postId)

    if (isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }
})

// postsRouter.post('/', (req: Request, res: Response) => {
//
//     const title = req.body.title
//     const shortDescription = req.body.shortDescription
//     const content = req.body.content
//     const bloggerId = req.body.bloggerId
//
//     const titleErrors = !title || typeof title !== 'string' || title.trim().length === 0 || title.trim().length > 30
//     const shortDescriptionErrors = !shortDescription || typeof shortDescription !== 'string' || shortDescription.length > 100
//     const contentErrors = !content || typeof content !== 'string' || content.trim().length === 0 || content.trim().length > 1000
//     const bloggerIdErrors = !bloggerId || typeof bloggerId !== "number"
//
//     const errorsMessages: ErrorResponseType = {errorsMessages: []}
//
//     if (titleErrors || shortDescriptionErrors || contentErrors || bloggerIdErrors) {
//
//         if (titleErrors) {
//             errorsMessages.errorsMessages.push({message: "Problem with a Title field", field: "title"})
//         }
//
//         if (shortDescriptionErrors) {
//             errorsMessages.errorsMessages.push({
//                 message: "Problem with a shortDescription field",
//                 field: "shortDescription"
//             })
//         }
//
//         if (contentErrors) {
//             errorsMessages.errorsMessages.push({message: "Problem with a Content field", field: "content"})
//         }
//
//         if (bloggerIdErrors) {
//             errorsMessages.errorsMessages.push({message: "Problem with a BloggerId field", field: "bloggerId"})
//         }
//
//         res.status(400).send(errorsMessages)
//
//     } else {
//         if (true) {
//             const newPost = postsRepository.createPost(title, shortDescription, content, bloggerId)
//             res.status(201).send(newPost)
//         } else {
//             errorsMessages.errorsMessages.push({message: "Blogger not found", field: "bloggerId"})
//             res.status(400).send(errorsMessages)
//         }
//     }
// })

// postsRouter.put('/:postId', (req: Request, res: Response) => {
//
//     let title = req.body.title
//     let shortDescription = req.body.shortDescription
//     let content = req.body.content
//     let bloggerId = req.body.bloggerId
//
//     let titleErrors = !title || typeof title !== 'string' || title.trim().length === 0 || title.trim().length > 30
//     let shortDescriptionErrors = !shortDescription || typeof shortDescription !== 'string' || shortDescription.length > 100
//     let contentErrors = !content || typeof content !== 'string' || content.trim().length === 0 || content.trim().length > 1000
//     let bloggerIdErrors = !bloggerId || typeof bloggerId !== "number"
//
//     const blogger = postsRepository.isBlogger(bloggerId);
//
//     if (titleErrors || shortDescriptionErrors || contentErrors || bloggerIdErrors || !blogger) {
//
//         let errorsMessages: ErrorResponseType = {errorsMessages: []}
//
//         if (titleErrors) {
//             errorsMessages.errorsMessages.push({message: "Problem with a Title field", field: "title"})
//         }
//
//         if (shortDescriptionErrors) {
//             errorsMessages.errorsMessages.push({
//                 message: "Problem with a shortDescription field",
//                 field: "shortDescription"
//             })
//         }
//
//         if (contentErrors) {
//             errorsMessages.errorsMessages.push({message: "Problem with a Content field", field: "content"})
//         }
//
//         if (bloggerIdErrors || !blogger) {
//             errorsMessages.errorsMessages.push({message: "Problem with a BloggerId field", field: "bloggerId"})
//         }
//
//         res.status(400).send(errorsMessages)
//         return;
//
//     } else {
//
//         const isUpdated = postsRepository.updatePost(+req.params.postId, title, shortDescription, content, bloggerId)
//
//         if (isUpdated) {
//             const blogPost = postsRepository.getPostById(+req.params.postId)
//             res.status(204).send(blogPost);
//             // res.send(204);
//         } else {
//             res.send(404)
//         }
//     }
// })


export type ErrorsMessagesType = {
    message: string
    field: string | null
}

export type ErrorResponseType = { errorsMessages: ErrorsMessagesType[] }

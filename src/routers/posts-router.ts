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

const bloggerIdErrorsMessage = { errorsMessages: [{ message: "wrong blogerId", field: "bloggerId" }] }


postsRouter.get('/', (req: Request, res: Response) => {
    const posts = postsRepository.getAllPosts()
    res.status(200).send(posts);
})

postsRouter.post('/',
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {
        const newPost = postsRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)

        if(newPost) {
            res.status(201).send(newPost)
        } else {
            res.status(400).send(bloggerIdErrorsMessage)
        }
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

export type ErrorsMessagesType = {
    message: string
    field: string | null
}

export type ErrorResponseType = { errorsMessages: ErrorsMessagesType[] }

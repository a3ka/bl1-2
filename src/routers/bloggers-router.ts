import {Request, Response, Router} from "express";
import {body} from "express-validator";
import {bloggersService} from "../domain/bloggers-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/auth-middleware";
import {postsService} from "../domain/posts-service";
import {postsRouter} from "./posts-router";
import {fieldsValidationMiddleware} from "../middlewares/fields-validation-middleware";

export const bloggersRouter = Router({})


// const nameValidation = body('name').trim().isLength({min: 1, max: 15}).isString()
// const youtubeValidation = body('youtubeUrl').trim().isLength({min: 1, max: 100}).isString().isURL()

bloggersRouter.get('/',
    async (req: Request, res: Response) => {
        const bloggers = await bloggersService.getAllBloggers()
        res.status(200).send(bloggers);
    }
)

bloggersRouter.post('/',
    authMiddleware,
    fieldsValidationMiddleware.nameValidation,
    fieldsValidationMiddleware.youtubeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const newBlogger = await bloggersService.createBlogger(req.body.name, req.body.youtubeUrl)
        res.status(201).send(newBlogger)
    }
)

bloggersRouter.get('/:bloggerId', async (req: Request, res: Response) => {
        const blogger = await bloggersService.getBloggerById(+req.params.bloggerId);
        if (blogger) {
            res.status(200).send(blogger);
        } else {
            res.send(404);
        }
    }
)

bloggersRouter.put('/:bloggerId',
    authMiddleware,
    fieldsValidationMiddleware.nameValidation,
    fieldsValidationMiddleware.youtubeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const isUpdated = await bloggersService.updateBlogger(+req.params.bloggerId, req.body.name, req.body.youtubeUrl)

        if (isUpdated) {
            const blogger = await bloggersService.getBloggerById(+req.params.bloggerId)
            res.status(204).send(blogger);
        } else {
            res.send(404)
        }
    }
)

bloggersRouter.delete('/:bloggerId',
    authMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await bloggersService.deleteBlogger(+req.params.bloggerId)
        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    }
)

bloggersRouter.get('/:bloggerId/posts', async (req: Request, res: Response) => {

    console.log(req.params.bloggerId)

    const posts = await bloggersService.getPostsByBloggerId(+req.params.bloggerId, req.body.pageNumber, req.body.pageSize);
        if (posts) {
            res.status(200).send(posts);
        } else {
            res.send(404);
        }
    }
)

bloggersRouter.post('/:bloggerId/posts',
    authMiddleware,
    fieldsValidationMiddleware.titleValidation,
    fieldsValidationMiddleware.shortDescriptionValidation,
    fieldsValidationMiddleware.contentValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        console.log(req.params.bloggerId)

        const newPost = await bloggersService.createPostByBloggerId(+req.params.bloggerId, req.body.title, req.body.shortDescription, req.body.content)

        if (newPost) {
            res.status(201).send(newPost)
        } else {
            res.status(400).send(fieldsValidationMiddleware.bloggerIdErrorsMessage)
        }
    })



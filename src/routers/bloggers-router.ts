import {Request, Response, Router} from "express";
import {body} from "express-validator";
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/auth-middleware";

export const bloggersRouter = Router({})


const nameValidation = body('name').trim().isLength({min: 1, max: 15}).isString()
const youtubeValidation = body('youtubeUrl').trim().isLength({min: 1, max: 100}).isString().isURL()

bloggersRouter.get('/',
    async (req: Request, res: Response) => {
        const bloggers = await bloggersRepository.getAllBloggers()
        res.status(200).send(bloggers);
    })

bloggersRouter.post('/',
    authMiddleware,
    nameValidation,
    youtubeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const newBlogger = await bloggersRepository.createBlogger(req.body.name, req.body.youtubeUrl)
        res.status(201).send(newBlogger)
    })

bloggersRouter.put('/:bloggerId',
    authMiddleware,
    nameValidation,
    youtubeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const isUpdated = await bloggersRepository.updateBlogger(+req.params.bloggerId, req.body.name, req.body.youtubeUrl)

        if (isUpdated) {
            const blogger = await bloggersRepository.getBloggerById(+req.params.bloggerId)
            res.status(204).send(blogger);
        } else {
            res.send(404)
        }
    })

bloggersRouter.get('/:bloggerId', async (req: Request, res: Response) => {

    const blogger = await bloggersRepository.getBloggerById(+req.params.bloggerId);

    if (blogger) {
        res.status(200).send(blogger);
    } else {
        res.send(404);
    }
})

bloggersRouter.delete('/:bloggerId',
    authMiddleware,
    async (req: Request, res: Response) => {

        const isDeleted = await bloggersRepository.deleteBlogger(+req.params.bloggerId)

        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    })



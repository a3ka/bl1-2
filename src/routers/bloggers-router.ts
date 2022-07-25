import {Request, Response, Router} from "express";
import {body} from "express-validator";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {ErrorResponseType} from "./posts-router";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/auth-middleware";


export const bloggersRouter = Router({})

// const nameValidation = body('name').trim().isLength({min: 1, max: 15}).isString().withMessage('Name should be `min: 1, max: 15` length')
// const youtubeValidation = body('youtubeUrl').trim().isLength({min: 1, max: 100}).isString().isURL().withMessage('youtubeUrl should be `min: 1, max: 100` length')

const nameValidation = body('name').trim().isLength({min: 1, max: 15}).isString()
const youtubeValidation = body('youtubeUrl').trim().isLength({min: 1, max: 100}).isString().isURL()


// bloggersRouter.get('/', (req: Request, res: Response) => {
//     res.send('Hello World!');
// })

bloggersRouter.get('/', (req: Request, res: Response) => {
    const bloggers = bloggersRepository.getAllBloggers()
    res.status(200).send(bloggers);
})


bloggersRouter.post('/',
    authMiddleware,
    nameValidation,
    youtubeValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {

        const newBlogger = bloggersRepository.createBlogger(req.body.name, req.body.youtubeUrl)
        res.status(201).send(newBlogger)
    })

bloggersRouter.put('/:bloggerId',
    authMiddleware,
    nameValidation,
    youtubeValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {

    const isUpdated = bloggersRepository.updateBlogger(+req.params.bloggerId, req.body.name, req.body.youtubeUrl)

    if (isUpdated) {
        const blogger = bloggersRepository.getBloggerById(+req.params.bloggerId)
        res.status(204).send(blogger);
    } else {
        res.send(404)
    }
})
//adasd

bloggersRouter.get('/:bloggerId', (req: Request, res: Response) => {

    const blogger = bloggersRepository.getBloggerById(+req.params.bloggerId);

    if (blogger) {
        res.status(200).send(blogger);
    } else {
        res.send(404);
    }
})

bloggersRouter.delete('/:bloggerId',
    authMiddleware,
    // inputValidationMiddleware,
    (req: Request, res: Response) => {

    const isDeleted = bloggersRepository.deleteBlogger(+req.params.bloggerId)

    if (isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }
})

// bloggersRouter.put('/:bloggerId', (req: Request, res: Response) => {
//
//     let name = req.body.name
//     let youtubeUrl = req.body.youtubeUrl
//     let pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
//     let youtubeUrlChecked = pattern.test(youtubeUrl)
//
//     let nameErrors = !name || typeof name !== 'string' || !name.trim() || name.length > 15
//     let youtubeUrlErrors = typeof youtubeUrl !== 'string' || youtubeUrl.length > 100 || youtubeUrlChecked === false
//
//     if (nameErrors || youtubeUrlErrors) {
//
//         let errorsMessages = {errorsMessages: []}
//
//         if (nameErrors) {
//             // @ts-ignore
//             errorsMessages.errorsMessages.push({message: "Problem with a Name field", field: "name"})
//         }
//
//         if (youtubeUrlErrors) {
//             // @ts-ignore
//             errorsMessages.errorsMessages.push({message: "Problem with a YoutubeUrl field", field: "youtubeUrl"})
//         }
//
//         res.status(400).send(errorsMessages)
//         return;
//
//     } else {
//
//         const isUpdated = bloggersRepository.updateBlogger(+req.params.bloggerId, name, youtubeUrl)
//
//         if (isUpdated) {
//             const blogger = bloggersRepository.getBloggerById(+req.params.bloggerId)
//             res.status(204).send(blogger);
//         } else {
//             res.send(404)
//         }
//     }
// })

// bloggersRouter.post('/', (req: Request, res: Response) => {
//
//     const name = req.body.name
//     const youtubeUrl = req.body.youtubeUrl
//     const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
//     const youtubeUrlChecked = pattern.test(youtubeUrl)
//     const nameErrors = !name || typeof name !== 'string' || !name.trim() || name.length > 15
//     const youtubeUrlErrors = typeof youtubeUrl !== 'string' || youtubeUrl.length > 100 || youtubeUrlChecked === false
//
//     if (nameErrors || youtubeUrlErrors) {
//
//         const errorsMessages: ErrorResponseType = {errorsMessages: []}
//
//         if (nameErrors) {
//             errorsMessages.errorsMessages.push({message: "Problem with a Name field", field: "name"})
//         }
//
//         if (youtubeUrlErrors) {
//             errorsMessages.errorsMessages.push({message: "Problem with a YoutubeUrl field", field: "youtubeUrl"})
//         }
//
//         res.status(400).send(errorsMessages)
//
//     } else {
//         const newBlogger = bloggersRepository.createBlogger(name, youtubeUrl)
//         res.status(201).send(newBlogger)
//     }
// })


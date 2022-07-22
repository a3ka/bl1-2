import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {postsRepository} from "../repositories/posts-repository";

export const bloggerIdExistenceValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const blogger = postsRepository.isBlogger(req.body.bloggerId);
    if (!blogger) {
        res.status(400).send({ errorsMessages: [{message: "Problem with a Title field", field: "title"}]});
    } else {
        next()
    }
}

import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        let errorsMessages = {errorsMessages: []}
        // @ts-ignore
        // let errors = errors.array()

        let errors = res.json({ errors: errors.array() })

        console.log('ERROR HERE!!!!' + errors)

        res.status(400).json(errors);
        // res.status(400).json({ errors: errors.array() });
    } else {
        next()
    }
}

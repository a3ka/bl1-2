import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors:any = validationResult(req);
    let errorsMessages:any =  []

    for (let i = 0; i < errors.length; i++) {
        Object.keys(errors[i]).forEach(key => {
            let value = errors[i][key];

            errorsMessages[i].push({})

            if(key === 'msg') {
                errorsMessages[i].message = value
            } else if (key === 'param') {
                errorsMessages[i].field = value
            } else {
                return
            }

            // console.log(`${key}: ${value}`);
        });
    }


    if (!errors.isEmpty()) {
        // res.status(400).json({ errorsMessages: errorsMessages.array() });
        res.status(400).json({ errorsMessages: errorsMessages });
    } else {
        next()
    }
}

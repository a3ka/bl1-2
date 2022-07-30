import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    const errorsMessages = errors.array({onlyFirstError: true}).map((error) => ({message: error.msg, field: error.param}))

    // @ts-ignore

    // const [...params] = () => {
    //     for (let i = 0; i < errorsMessages.length; i++) {
    //         return Object.keys (errorsMessages[i])
    //     }
    // }







    // for (let i = 0; i < errorsMessages.length; i++) {
    //     Object.keys(errorsMessages[i]).forEach(key => {
    //         // @ts-ignore
    //         let value = errorsMessages[i][key];
    //
    //         errorsMessages[i].push({})
    //
    //         if(key === 'msg') {
    //             errorsMessages[0].message = value
    //         } else if (key === 'param') {
    //             errorsMessages[0].field = value
    //         } else {
    //             return
    //         }
    //
    //         // console.log(`${key}: ${value}`);
    //     });
    // }



    const getErrors = (errorsMessages: any) => {
        if(errorsMessages.length > 1) {
            if(errorsMessages[0].field === errorsMessages[1].field) {
                return [errorsMessages[0]]
            } else {
                return errorsMessages
            }
        } else {
            return errorsMessages
        }
    }

    if (!errors.isEmpty()) {
        res.status(400).send({ errorsMessages: getErrors(errorsMessages)});
        // res.status(400).json({ errorsMessages: errorsMessages});
    } else {
        next()
    }
}

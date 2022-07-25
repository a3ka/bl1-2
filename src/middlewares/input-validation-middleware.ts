import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    const errorsMessages = errors.array().map((error) => ({message: error.msg, field: error.param}))

    // @ts-ignore
    console.log(errors[0])
    console.log(errorsMessages)

    // let errorsMessages:any =  [{}]
    // for (let i = 0; i < errors.length; i++) {
    //     Object.keys(errors[i]).forEach(key => {
    //         let value = errors[i][key];
    //
    //         if(i !== 0) {
    //             errorsMessages.push({})
    //         }
    //
    //         if(key === 'msg') {
    //             errorsMessages[i].message = value
    //         } else if (key === 'param') {
    //             errorsMessages[i].field = value
    //         } else {
    //             return
    //         }
    //
    //         // console.log(`${key}: ${value}`);
    //     });
    // }


    if (!errors.isEmpty()) {
        res.status(400).send({ errorsMessages: errorsMessages[0]});
        // res.status(400).json({ errorsMessages: errorsMessages});
    } else {
        next()
    }
}

import { Bearer } from 'permit';
import jwtSimple from 'jwt-simple';
import express from 'express';
import jwt from './jwt';
//import { userRecords, blackListToken } from '../server';

const permit = new Bearer({
    query: "access_token"
})

export async function isLoggedIn(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction) {

    try {
        const token: any = permit.check(req)
        if (!token) {
            return res.status(401).json({ msg: "Missing Token" });
        }
        console.log("token: ", token)

        // 驗證
        const payload = jwtSimple.decode(token, jwt.jwtSecret);
        console.log("payload: ", payload)

        const userId: any = payload.user_id
        // Call Database getUserByUserId
        console.log("userId: ", userId)

        if (userId) {
            req.user_id = userId
            req.token = token
            return next();
        } else {
            return res.status(401).json({ msg: "Permission Denied" });
        }
    } catch (e) {
        return res.status(401).json({ msg: "Wrong Token" });
    }
}

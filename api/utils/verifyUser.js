import jwt from 'jsonwebtoken';
import session from 'express-session';
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return next(errorHandler(401, "Unauthorized"));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            res.clearCookie('access_token');
            req.session.destroy(() => {
                res.redirect('/sign-in');
            });
            return next(errorHandler(403, "Forbidden"));
        }
        req.user = user;
        next();
    })
}
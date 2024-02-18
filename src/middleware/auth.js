import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env')
});

const jwtSecret = process.env.JWT_SECRET_KEY || '';
if (!jwtSecret) {
  throw new Error("Unable to retrieve JWT Secret Key from env");
}

export default async function authorization(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader && authHeader.split(' ')[1] || '';

  if (token) {
    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(403).json({ error: 'Failed to authenticate token.' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).send("Authorization Token is Missing");
  }
}

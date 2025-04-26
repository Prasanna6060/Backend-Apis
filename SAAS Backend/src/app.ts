import express from 'express';
import { Request, Response } from 'express';

const Port = 3000;

const app = express();

app.get('/',(req: Request, res: Response) => {
    res.send("hello world");
})

export default app;
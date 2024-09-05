import express from 'express';
import path, { resolve } from 'path';
import serveStatic from 'serve-static';
import { createServer } from 'https';
import fs from 'fs';

const app = express();

const __dirname = path.resolve();

// config TLS for https
const TLSconfig = {
    key: fs.readFileSync(resolve(__dirname, 'certs', 'privkey.pem')),
    cert: fs.readFileSync(resolve(__dirname, 'certs', 'cert.cer'))
};

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});

app.use(serveStatic(__dirname + "/dist"));

const server = createServer(TLSconfig, app);


server.listen(process.env.PORT || 3000, () => {
    console.log(`Server running at https://127.0.0.1:${server.address().port}/`);
});
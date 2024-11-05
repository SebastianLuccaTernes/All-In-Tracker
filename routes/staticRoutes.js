import { Router } from 'express';
import { readFile } from 'fs';

const router = Router();

router.get('/', (req, res) => {
    readFile('./templates/home.html', 'utf8', (err, html) => {
        if (err) {
            res.status(500).send('Sorry, out of order');
            return;
        }
        res.send(html);
    });
});

router.get('/learning', (req, res) => {
    readFile('./templates/learning.html', 'utf8', (err, html) => {
        if (err) {
            res.status(500).send('Sorry, out of order');
            return;
        }
        res.send(html);
    });
});

router.get('/cheatsheet', (req, res) => {
    readFile('./templates/cheatsheet.html', 'utf8', (err, html) => {
        if (err) {
            res.status(500).send('Sorry, out of order');
            return;
        }
        res.send(html);
    });
});

export default router;
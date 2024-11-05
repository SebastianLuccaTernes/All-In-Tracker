import express from 'express';

const setupMiddleware = (app) => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(
        express.static('public', {
            setHeaders: (res, path) => {
                if (path.endsWith('.js')) {
                    res.set('Content-Type', 'application/javascript');
                }
            },
        })
    );
};

export default setupMiddleware;
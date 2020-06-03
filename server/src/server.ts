import express from 'express';

const app = express();

app.get('/users', (request, response) => {
    console.log('oi');

    response.json([
        'oi',
        'ab',
        'i'
    ]);
});

app.listen(3333);
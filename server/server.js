const express = require('express');
const app = express();
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser');
const paginate = require('jw-paginate');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// paged items route
app.get('/api/items', (req, res, next) => {
    // example array of 150 items to be paged
    const items = [...Array(150).keys()].map(i => ({ id: (i + 1), name: 'Item ' + (i + 1) }));

    // get page from query params or default to first page
    const page = parseInt(req.query.page) || 1;

    // get pager object for specified page
    const pageSize = 5;
    const pager = paginate(items.length, page, pageSize);

    // get page of items from items array
    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

    // return pager object and current page of items
    return res.json({ pager, pageOfItems });
});

// proxy requests for front end to client app
app.use('/', function(req, res) {
    request('http://localhost:8081' + req.path)
        .on('error', err => res.send('client not started yet, try refreshing in a few seconds'))
        .pipe(res);
});

// start server
const port = 8080;
app.listen(port, () => console.log('Server listening on port ' + port));


const mongoose = require('mongoose');

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/so-posts', { useMongoClient: true });

const { server } = require('./server.js');

server.listen(3030, () => {
    console.log('server is listening on port 3030');
});

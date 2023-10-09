// app.js

const express = require('express');
const app = express();
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршруты из других модулей
app.get('/', (req, res) => {
  res.json({ message: 'welcome' });
});

require('./routes/categoriesRoutes')(app);
require('./routes/booksRoutes')(app);
require('./routes/authorsRoutes')(app);
require('./routes/usersroutes')(app);
// Подключите authRoutes.js и передайте app
require('./routes/auth')(app);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library',
      version: '0.1.0',
      description: 'This is your API documentation.',
    },
    servers: [
      {
        url: 'http://localhost:3000/',
        description: 'Local development server',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ${PORT}.`);
});

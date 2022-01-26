import jsonServer from 'json-server';

const app = jsonServer.create();
const router = jsonServer.router('db.json');
const middleware = jsonServer.defaults();

app.get('/hello', (_, res) => {
  res.json({ message: 'hello' });
});

app.use('/api', middleware);
app.use('/api', router);

export const handler = app;

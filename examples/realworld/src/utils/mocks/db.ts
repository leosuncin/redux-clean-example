import { factory, primaryKey } from '@mswjs/data';

function* generateId() {
  let id = 1;

  while (true) {
    yield id++;
  }
}

const userId = generateId();

export const db = factory({
  user: {
    id: primaryKey<number>(() => Number(userId.next().value)),
    email: String,
    username: String,
    bio: String,
    image: String,
  },
});

db.user.create({
  email: 'admin@example.com',
  username: 'admin',
  bio: 'The secret life of a Dev',
  image: 'https://thispersondoesnotexist.com/image',
});
db.user.create({
  email: 'username@example.com',
  username: 'username',
  bio: 'I am nobody',
  image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
});

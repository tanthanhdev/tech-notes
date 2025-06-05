// Create a user for the database
db.createUser({
  user: 'user',
  pwd: 'password',
  roles: [
    {
      role: 'readWrite',
      db: 'tech_notes'
    }
  ]
});

// Switch to the tech_notes database
db = db.getSiblingDB('tech_notes');

// Create collections
db.createCollection('users');
db.createCollection('posts');

// Insert sample data into users collection
db.users.insertMany([
  {
    username: 'user1',
    email: 'user1@example.com',
    created_at: new Date()
  },
  {
    username: 'user2',
    email: 'user2@example.com',
    created_at: new Date()
  },
  {
    username: 'user3',
    email: 'user3@example.com',
    created_at: new Date()
  }
]);

// Get the user IDs
const user1 = db.users.findOne({ username: 'user1' });
const user2 = db.users.findOne({ username: 'user2' });
const user3 = db.users.findOne({ username: 'user3' });

// Insert sample data into posts collection
db.posts.insertMany([
  {
    title: 'First Post',
    content: 'This is the content of the first post',
    user_id: user1._id,
    created_at: new Date()
  },
  {
    title: 'Second Post',
    content: 'This is the content of the second post',
    user_id: user1._id,
    created_at: new Date()
  },
  {
    title: 'Hello World',
    content: 'Hello world post content',
    user_id: user2._id,
    created_at: new Date()
  },
  {
    title: 'Database Demo',
    content: 'This is a demonstration of MongoDB database',
    user_id: user3._id,
    created_at: new Date()
  }
]);

const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;
const db = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/acme_db'
);
const faker = require('faker');

const User = db.define(
  'user',
  {
    name: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.TEXT,
    },
  },
  {
    hooks: {
      beforeCreate: function (user) {
        if (!user.bio) {
          user.bio = `${user.name}. ${faker.lorem.paragraphs(3)} ${user.name}`;
        }
      },
    },
  }
);

User.createWithName = (name) => User.create({ name });

const syncAndSeed = async () => {
  await db.sync({ force: true });
  const [moe, lucy, curly] = await Promise.all(
    ['moe', 'lucy', 'curly'].map(User.createWithName)
  );
  console.log(lucy.get());
};

module.exports = { models: { User }, syncAndSeed };

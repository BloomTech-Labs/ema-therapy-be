const graphql = require('graphql');
const User = require('../models/user');
const { MoodsField } = require('./moods');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLID,
  GraphQLFloat,
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    sub: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    moods: MoodsField,
  }),
});

const UsersField = {
  type: new GraphQLList(UserType),
  resolve() {
    return User.find({});
  },
};

const UserField = {
  type: UserType,
  args: {
    sub: { type: GraphQLID },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    // check if user exists
    await User.count({ sub: args.sub }, (err, count) => {
      if (err) console.log(err);
      // add user if they do not exist
      if (count === 0) {
        let user = new User({
          email: args.email,
          sub: args.sub,
          firstName: args.firstName,
          lastName: args.lastName,
        });
        user.save();
      }
    });
    return User.findOne({ sub: args.sub });
  },
};

module.exports = {
  UsersField,
  UserType,
  UserField,
};

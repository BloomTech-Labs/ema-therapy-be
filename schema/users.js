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

// field for multiple users
const UsersField = {
  type: new GraphQLList(UserType),
  resolve() {
    return User.find({});
  },
};

// field for single user
const UserField = {
  type: UserType,
  args: {
    sub: { type: GraphQLID },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    const user = await User.findOne({ sub: args.sub }).exec();
    // if user doen't exist
    if (!user) {
      // await user creation, then return user
      const savedUser = await User.create({
        email: args.email,
        sub: args.sub,
        firstName: args.firstName,
        lastName: args.lastName,
      }).exec();
      return savedUser;
    } else {
      return user;
    }
  },
};

// field to add user
const addUserField = {
  type: UserType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    sub: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
  },
  resolve(_, args) {
    let user = new User({
      email: args.email,
      sub: args.sub,
      firstName: args.firstName,
      lastName: args.lastName,
    });
    return user.save();
  },
};

module.exports = {
  UsersField,
  UserType,
  UserField,
  addUserField,
};

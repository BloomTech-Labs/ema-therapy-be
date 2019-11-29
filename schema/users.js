const graphql = require('graphql');
const User = require('../models/user');
const { MoodsField } = require('./moods');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLBoolean,
  GraphQLNonNull,
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
    isSharingLocation: { type: GraphQLBoolean },
    moods: MoodsField,
  }),
});

// field for multiple users query
const UsersField = {
  type: new GraphQLList(UserType),
  resolve() {
    return User.find({});
  },
};

// field for single user query
const UserField = {
  type: UserType,
  args: {
    sub: { type: GraphQLID },
    email: { type: GraphQLString },
    isSharingLocation: { type: GraphQLBoolean },
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
        isSharingLocation: args.isSharingLocation,
        firstName: args.firstName,
        lastName: args.lastName,
      });
      return savedUser;
    } else {
      return user;
    }
  },
};

// field to add user mutation
const addUserField = {
  type: UserType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    sub: { type: new GraphQLNonNull(GraphQLString) },
    isSharingLocation: { type: GraphQLBoolean },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    const createdUser = await User.create({
      email: args.email,
      sub: args.sub,
      isSharingLocation: args.isSharingLocation,
      firstName: args.firstName,
      lastName: args.lastName,
    });
    return createdUser;
  },
};

// field to change Sharing Location mutation
const isSharingLocationField = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    isSharingLocation: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  async resolve(_, args) {
    await User.findByIdAndUpdate(
      args.id,
      {
        isSharingLocation: args.isSharingLocation,
      },
      (error) => {
        if (error) {
          return next(error);
        }
      },
    );
    return User.findById(args.id);
  },
};

module.exports = {
  UsersField,
  UserType,
  UserField,
  addUserField,
  isSharingLocationField,
};

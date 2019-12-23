const graphql = require('graphql');
const User = require('../models/user');
const { MoodsField } = require('./moods');
const { TasksField } = require('./tasks');

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
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    isSharingLocation: { type: GraphQLBoolean },
    moods: MoodsField,
    tasks: TasksField,
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
    email: { type: GraphQLString },
    isSharingLocation: { type: GraphQLBoolean },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    const user = await User.findOne({ email: args.email }).exec();
    // if user doen't exist
    if (!user) {
      // await user creation, then return user
      const savedUser = await User.create({
        email: args.email,
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
    isSharingLocation: { type: GraphQLBoolean },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    const createdUser = await User.create({
      email: args.email,
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
    let updatedUser = null;
    try {
      updatedUser = await User.findByIdAndUpdate(
        args.id,
        {
          isSharingLocation: args.isSharingLocation,
        },
        {
          new: true,
        },
      ).exec();
    } catch (err) {
      console.log('Unable to update isSharingLocation:', err);
    }
    return updatedUser;
  },
};

module.exports = {
  UsersField,
  UserType,
  UserField,
  addUserField,
  isSharingLocationField,
};

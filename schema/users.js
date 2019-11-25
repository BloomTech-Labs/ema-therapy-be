const graphql = require('graphql');
const User = require('../models/user');
const { MoodsField } = require('./moods');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLBoolean,
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

const UsersField = {
  type: new GraphQLList(UserType),
  resolve() {
    return User.find({});
  },
};

module.exports = {
  UsersField,
  UserType,
};

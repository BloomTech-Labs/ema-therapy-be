const graphql = require('graphql');

// model imports
const User = require('../models/user');
const Mood = require('../models/mood');

// schema field and type imports
const { UserType, UsersField, UserField, addUserField } = require('./users');
const {
  MoodType,
  addMoodField,
  removeMoodField,
  editMoodField,
} = require('./moods');

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

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // fields are now imported from schema/users.js and schema/moods.js
    users: UsersField,
    user: UserField,
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // fields are now imported from schema/users.js and schema/moods.js
    addUser: addUserField,
    addMood: addMoodField,
    removeMood: removeMoodField,
    editMood: editMoodField,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

const graphql = require('graphql');

// model imports
const User = require('../models/user');
const Mood = require('../models/mood');

// schema field and type imports
const {
  UsersField,
  UserField,
  addUserField,
  isSharingLocationField,
} = require('./users');
const {
  MoodType,
  addMoodField,
  removeMoodField,
  editMoodField,
} = require('./moods');

const { GraphQLObjectType, GraphQLSchema } = graphql;

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
    addUser: addUserField,
    updateIsSharingLocation: isSharingLocationField,
    addMood: addMoodField,
    removeMood: removeMoodField,
    editMood: editMoodField,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

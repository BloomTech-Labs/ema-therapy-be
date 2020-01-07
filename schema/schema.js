const graphql = require('graphql');

const {
  UsersField,
  UserField,
  addUserField,
  isSharingLocationField,
} = require('./users');

const { addMoodField, removeMoodField, editMoodField } = require('./moods');

const { addTaskField, removeTaskField } = require('./tasks');

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
    addTask: addTaskField,
    removeTask: removeTaskField,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

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
  GraphQLNonNull,
  GraphQLInt,
  GraphQLID,
  GraphQLFloat,
  GraphQLBoolean,
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
    addUser: addUserField,
    updateIsSharingLocation: {
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
    },
    addMood: {
      type: MoodType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLID) },
        mood: { type: new GraphQLNonNull(GraphQLInt) },
        sleep: { type: GraphQLFloat },
        anxietyLevel: { type: GraphQLInt },
        text: { type: GraphQLString },
        weather: { type: GraphQLString },
      },
      resolve(_, args) {
        let mood = new Mood({
          userId: args.userId,
          mood: args.mood,
          sleep: args.sleep,
          anxietyLevel: args.anxietyLevel,
          text: args.text,
          weather: args.weather,
        });
        return mood.save();
      },
    },
    removeMood: {
      type: MoodType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(_, args) {
        const remMood = Mood.findByIdAndRemove(args.id).exec();
        if (!remMood) {
          throw new Error('Error');
        }
        return remMood;
      },
    },
    editMood: {
      type: MoodType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        mood: { type: new GraphQLNonNull(GraphQLInt) },
        sleep: { type: GraphQLFloat },
        anxietyLevel: { type: GraphQLInt },
        text: { type: GraphQLString },
        weather: { type: GraphQLString },
      },
      async resolve(_, args) {
        await Mood.findByIdAndUpdate(
          args.id,
          {
            mood: args.mood,
            sleep: args.sleep,
            anxietyLevel: args.anxietyLevel,
            text: args.text,
            weather: args.weather,
          },
          (error) => {
            if (error) {
              return next(error);
            }
          },
        );
        return Mood.findById(args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

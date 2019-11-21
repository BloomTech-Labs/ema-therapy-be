const graphql = require('graphql');
const User = require('../models/user');
const Mood = require('../models/mood');
const { UserType, UsersField, UserField } = require('./users');
const { MoodType } = require('./moods');

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
    users: UsersField,
    user: UserField,
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
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

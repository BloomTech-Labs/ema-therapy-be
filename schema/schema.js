const graphql = require('graphql');
const User = require('../models/user');
const Mood = require('../models/mood');
const { UserType, UsersField } = require('./users');
const { MoodType } = require('./moods');

const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLInputObjectType,
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
    users: UsersField,
    user: {
      type: UserType,
      args: {
        sub: { type: GraphQLID },
        email: { type: GraphQLString },
        isSharingLocation: { type: GraphQLBoolean },
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
              isSharingLocation: args.isSharingLocation,
              firstName: args.firstName,
              lastName: args.lastName,
            });
            user.save();
          }
        });
        return User.findOne({ sub: args.sub });
      },
    },
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
        isSharingLocation: { type: GraphQLBoolean },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
      },
      resolve(_, args) {
        let user = new User({
          email: args.email,
          sub: args.sub,
          isSharingLocation: args.isSharingLocation,
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
        // this might be set up to take a new obj but not an array of objs might need to
        // imbed diff data types with same logic here, also review this whole gql thing
        activities: { type: GraphQLString },
        sleep: { type: GraphQLFloat },
        anxietyLevel: { type: GraphQLInt },
        text: { type: GraphQLString },
        weather: { type: GraphQLString },
      },
      resolve(_, args) {
        console.log('args in be', args);
        let mood = new Mood({
          userId: args.userId,
          mood: args.mood,
          activities: args.activities,
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

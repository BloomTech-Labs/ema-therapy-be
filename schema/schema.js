const graphql = require('graphql');
const User = require('../models/user');
const Mood = require('../models/mood');
const { UserType, UsersField } = require('./users');
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
    user: {
      type: UserType,
      args: {
        sub: { type: GraphQLID },
        email: { type: GraphQLString },
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
        mood: { type: new GraphQLNonNull(GraphQLInt) },
        text: { type: GraphQLString },
        anxietyLevel: { type: GraphQLInt },
        sleep: { type: GraphQLFloat },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(_, args) {
        let mood = new Mood({
          mood: args.mood,
          text: args.text,
          anxietyLevel: args.anxietyLevel,
          sleep: args.sleep,
          userId: args.userId,
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
        text: { type: GraphQLString },
        sleep: { type: GraphQLFloat },
        anxietyLevel: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(_, args) {
        await Mood.findByIdAndUpdate(
          args.id,
          {
            mood: args.mood,
            text: args.text,
            sleep: args.sleep,
            anxietyLevel: args.anxietyLevel,
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

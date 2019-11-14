const graphql = require('graphql');
const User = require('../models/user');
const Mood = require('../models/mood');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLID,
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    sub: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    moods: {
      type: new GraphQLList(MoodType),
      resolve(parent, args) {
        return Mood.find({ userId: parent.id });
      },
    },
  }),
});

const MoodType = new GraphQLObjectType({
  name: 'Mood',
  fields: () => ({
    id: { type: GraphQLID },
    createdAt: { type: GraphQLString },
    mood: { type: GraphQLInt },
    intensity: { type: GraphQLInt },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({});
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return User.findById(args.id);
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
      },
      resolve(_, args) {
        let user = new User({
          email: args.email,
          sub: args.sub,
        });
        return user.save();
      },
    },
    addMood: {
      type: MoodType,
      args: {
        mood: { type: new GraphQLNonNull(GraphQLInt) },
        intensity: { type: new GraphQLNonNull(GraphQLInt) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(_, args) {
        let mood = new Mood({
          mood: args.mood,
          intensity: args.intensity,
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
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

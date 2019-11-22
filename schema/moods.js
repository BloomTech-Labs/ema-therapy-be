const graphql = require('graphql');
const Mood = require('../models/mood');

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

const MoodType = new GraphQLObjectType({
  name: 'Mood',
  fields: () => ({
    id: { type: GraphQLID },
    mood: { type: GraphQLInt },
    text: { type: GraphQLString },
    anxietyLevel: { type: GraphQLInt },
    sleep: { type: GraphQLFloat },
    createdAt: { type: GraphQLString },
    weather: { type: GraphQLString },
  }),
});

const MoodsField = {
  type: new GraphQLList(MoodType),
  resolve(parent, args) {
    console.log('DJFISOPAFHDIOAFHDUIFOASHFI');
    return Mood.find({ userId: parent.id });
  },
};

module.exports = {
  MoodsField,
  MoodType,
};

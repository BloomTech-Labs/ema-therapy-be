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
    return Mood.find({ userId: parent.id });
  },
};

// mood mutations fields
const addMoodField = {
  type: MoodType,
  args: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
    mood: { type: new GraphQLNonNull(GraphQLInt) },
    sleep: { type: GraphQLFloat },
    anxietyLevel: { type: GraphQLInt },
    text: { type: GraphQLString },
    weather: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    const createdMood = await Mood.create({
      userId: args.userId,
      mood: args.mood,
      sleep: args.sleep,
      anxietyLevel: args.anxietyLevel,
      text: args.text,
      weather: args.weather,
    });
    return createdMood;
  },
};

const removeMoodField = {
  type: MoodType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve(_, args) {
    const remMood = Mood.findByIdAndRemove(args.id).exec();
    if (!remMood) {
      throw new Error('Could not find mood for given id');
    }
    return remMood;
  },
};

const editMoodField = {
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
    // Only update the fields which are not undefined
    const fieldsToUpdate = {};
    const fieldNames = ['mood', 'sleep', 'anxietyLevel', 'text', 'weather'];
    for (let i = 0; i < fieldNames.length; i++) {
      let fieldName = fieldNames[i];
      if (typeof args[fieldName] !== 'undefined') {
        fieldsToUpdate[fieldName] = args[fieldName];
      }
    }
    const updatedMood = await Mood.findByIdAndUpdate(args.id, fieldsToUpdate, {
      new: true,
    }).exec();
    return updatedMood;
  },
};

module.exports = {
  MoodsField,
  MoodType,
  addMoodField,
  removeMoodField,
  editMoodField,
};

const graphql = require('graphql');
const Task = require('../models/task');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} = graphql;

const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    id: { type: GraphQLID },
    completedAt: { type: GraphQLString },
    userEmail: { type: GraphQLString },
    prompt: { type: GraphQLString },
    text: { type: GraphQLString },
    photoUrl: { type: GraphQLString },
  }),
});

const TasksField = {
  type: new GraphQLList(TaskType),
  resolve(parent, args) {
    return Task.find({ userEmail: parent.email });
  },
};

const addTaskField = {
  type: TaskType,
  args: {
    userEmail: { type: new GraphQLNonNull(GraphQLString) },
    prompt: { type: new GraphQLNonNull(GraphQLString) },
    text: { type: GraphQLString },
    photoUrl: { type: GraphQLString },
  },
  resolve(parent, args) {
    let task = new Task({
      userEmail: args.userEmail,
      prompt: args.prompt,
      text: args.text,
      photoUrl: args.photoUrl,
    });
    return task.save();
  },
};

module.exports = {
  TasksField,
  addTaskField,
};

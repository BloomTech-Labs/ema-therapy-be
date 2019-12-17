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
    userId: { type: GraphQLID },
    prompt: { type: GraphQLString },
    // allows you to query the entire list of inputs
    inputList: { type: new GraphQLList(GraphQLString) },
  }),
});

const TasksField = {
  type: new GraphQLList(TaskType),
  resolve(parent, args) {
    return Task.find({ userId: parent.id });
  },
};

const addTaskField = {
  type: TaskType,
  args: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
    prompt: { type: new GraphQLNonNull(GraphQLString) },
    // allows you to save all inputs from task as an array in MongoDB
    inputList: { type: new GraphQLList(GraphQLString) },
  },
  resolve(parent, args) {
    let task = new Task({
      userId: args.userId,
      prompt: args.prompt,
      inputList: args.inputList,
    });
    return task.save();
  },
};

module.exports = {
  TasksField,
  addTaskField,
};

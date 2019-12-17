const graphql = require('graphql');
const Task = require('../models/task');
const TaskInput = require('../models/taskInput');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} = graphql;

const TaskInputType = new GraphQLObjectType({
  name: 'TaskInput',
  fields: () => ({
    id: { type: GraphQLID },
    text: { type: GraphQLString },
    taskId: { type: GraphQLID },
  }),
});

const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    id: { type: GraphQLID },
    completedAt: { type: GraphQLString },
    userId: { type: GraphQLID },
    prompt: { type: GraphQLString },
    inputList: {
      type: new GraphQLList(TaskInputType),
      resolve(parent, args) {
        return TaskInput.find({ taskId: parent.id });
      },
    },
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
  },
  resolve(parent, args) {
    let task = new Task({
      userId: args.userId,
      prompt: args.prompt,
    });
    return task.save();
  },
};

const addTaskInputField = {
  type: TaskInputType,
  args: {
    taskId: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: GraphQLString },
  },
  resolve(parent, args) {
    let taskInput = new TaskInput({
      taskId: args.taskId,
      text: args.text,
    });
    return taskInput.save();
  },
};

module.exports = {
  TasksField,
  addTaskField,
  addTaskInputField,
};

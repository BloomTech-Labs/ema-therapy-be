const { graphql, GraphQLObjectType, GraphQLSchema } = require('graphql');

const Mood = require('../models/mood');

const {
  addMoodField,
  removeMoodField,
  editMoodField,
} = require('../schema/moods');

describe('addMood mutation', () => {
  it('adds mood and returns appropriate mood information', () => {
    const schema = new GraphQLSchema({
      // The entire query block is just to appease graphql validation
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          addMood: addMoodField,
        },
      }),
    });

    const mockMood1 = {
      mood: 3,
      sleep: 8.7,
      anxietyLevel: 3,
      text: 'Test text field.',
      weather: 'Test weather field.',
    };

    const mockUserId = '123';

    const query = `
      {
        addMood(userId: "${mockUserId}", mood: ${mockMood1.mood}, sleep: ${mockMood1.sleep}, anxietyLevel: ${mockMood1.anxietyLevel}, text: "${mockMood1.text}", weather: "${mockMood1.weather}"){
          mood
          sleep
          anxietyLevel
          text
          weather
        }
      }
    `;

    let creationParams = {};

    jest.spyOn(Mood, 'create').mockImplementation((params) => {
      creationParams = params;
      return mockMood1;
    });

    return graphql(schema, query, {}, {}).then((result) => {
      expect(result).not.toBe(null);
      expect(result.data).toEqual({
        addMood: mockMood1,
      });
      expect(creationParams.userId).toEqual(mockUserId);
    });
  });
});

describe('removeMood mutation', () => {
  it('removes mood and returns said mood', () => {
    const schema = new GraphQLSchema({
      // The entire query block is just to appease graphql validation
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          removeMood: removeMoodField,
        },
      }),
    });

    const mockMood1 = {
      id: '13',
      mood: 3,
      sleep: 8.7,
      anxietyLevel: 3,
      text: 'Test text field.',
      weather: 'Test weather field.',
    };

    const query = `
      {
        removeMood(id: "${mockMood1.id}") {
          id
          mood
          sleep
          anxietyLevel
          text
          weather
        }
      }
    `;

    const findSpy = jest
      .spyOn(Mood, 'findByIdAndRemove')
      .mockImplementation(() => {
        return {
          exec: () => {
            return mockMood1;
          },
        };
      });

    return graphql(schema, query, {}, {}).then((result) => {
      expect(result).not.toBe(null);
      expect(result.data).toEqual({
        removeMood: mockMood1,
      });
      expect(findSpy.mock.calls[0][0]).toEqual(mockMood1.id);
    });
  });

  it('throws correct error when mood to remove not found', () => {
    const schema = new GraphQLSchema({
      // The entire query block is just to appease graphql validation
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          removeMood: removeMoodField,
        },
      }),
    });

    const query = `
      {
        removeMood(id: "testID") {
          id
          mood
          sleep
          anxietyLevel
          text
          weather
        }
      }
    `;

    jest.spyOn(Mood, 'findByIdAndRemove').mockImplementation(() => {
      return {
        exec: () => {
          return null;
        },
      };
    });

    return graphql(schema, query, {}, {}).then((result) => {
      expect(result).toMatchSnapshot();
    });
  });
});

describe('editMood mutation', () => {
  it('edits correct fields and returns edited data', () => {
    const schema = new GraphQLSchema({
      // The entire query block is just to appease graphql validation
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          editMood: editMoodField,
        },
      }),
    });

    const mockMood1 = {
      mood: 3,
      sleep: 8.7,
      anxietyLevel: 3,
      text: 'Test text field.',
      weather: 'Test weather field.',
    };

    const mockId = '3';

    const query = `
      {
        editMood(id: "${mockId}", mood: ${mockMood1.mood}, sleep: ${mockMood1.sleep}, anxietyLevel: ${mockMood1.anxietyLevel}, text: "${mockMood1.text}", weather: "${mockMood1.weather}"){
          id
          mood
          sleep
          anxietyLevel
          text
          weather
        }
      }
    `;

    const updateMoodSpy = jest
      .spyOn(Mood, 'findByIdAndUpdate')
      .mockImplementation(() => {
        return {
          exec: () => {
            return mockMood1;
          },
        };
      });
    return graphql(schema, query, {}, {}).then((result) => {
      expect(result).not.toBe(null);
      expect(result.data).toMatchSnapshot();
      expect(updateMoodSpy.mock.calls[0]).toEqual([
        mockId,
        mockMood1,
        { new: true },
      ]);
    });
  });
});

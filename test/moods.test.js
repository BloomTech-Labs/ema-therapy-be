const {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} = require('graphql');
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

    return graphql(schema, query, {}, {}).then(
      (result) => {
        expect(result).not.toBe(null);
        console.log(result);
        expect(result.data).toEqual({
          addMood: mockMood1,
        });
        expect(creationParams.userId).toEqual(mockUserId);
      },
      (result) => {
        console.log(result);
      },
    );
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

    return graphql(schema, query, {}, {}).then(
      (result) => {
        expect(result).not.toBe(null);
        expect(result.data).toEqual({
          removeMood: mockMood1,
        });
        expect(findSpy.mock.calls[0][0]).toEqual(mockMood1.id);
      },
      (result) => {
        console.log(result);
      },
    );
  });
});

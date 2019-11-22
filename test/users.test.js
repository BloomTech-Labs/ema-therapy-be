const { graphql, GraphQLObjectType, GraphQLSchema } = require('graphql');
const User = require('../models/user');
const { UsersField, UserField, addUserField } = require('../schema/users');
const { when } = require('jest-when');

afterEach(() => {
  console.log('clearing mocks');
  jest.clearAllMocks();
});

describe('multiple users query', () => {
  it('returns appropriate array of users with user data', () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          users: UsersField,
        },
      }),
    });
    const query = `{
      users {
        id
        email
        sub
        firstName
        lastName
        createdAt
      }
    }`;
    const mockUser1 = {
      id: '8675309',
      email: 'test@help.com',
      sub: 'fakeSub',
      firstName: 'testy',
      lastName: 'mctestface',
      createdAt: `${Date.now()}`,
    };
    const mockUser2 = {
      id: 'pain',
      email: 'graphql@sucks.com',
      sub: 'shouldHaveBeenAnOptometrist',
      firstName: 'why',
      lastName: 'noooooooo',
      createdAt: `${Date.now()}`,
    };

    jest
      .spyOn(User, 'find')
      .mockReturnValue(Promise.resolve([mockUser1, mockUser2]));

    return graphql(schema, query, {}, {}).then((result) => {
      expect(result).not.toBe(null);
      expect(result.data).toEqual({
        users: [mockUser1, mockUser2],
      });
    });
  });
});

describe('single user query', () => {
  it('returns appropriate user when sub is provided and user exists', () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          user: UserField,
        },
      }),
    });

    const mockUser1 = {
      id: '867530900',
      email: 'test2@help.com',
      sub: 'fakeSub2',
      firstName: 'testy2',
      lastName: 'mctestface2',
      createdAt: `${Date.now()}`,
    };

    const query = `{
      user(sub: "${mockUser1.sub}") {
        id
        email
        sub
        firstName
        lastName
        createdAt
      }
    }`;

    const userFindOneSpy = jest
      .spyOn(User, 'findOne')
      .mockImplementation((searchParams) => {
        return {
          exec: () => {
            if (searchParams.sub === mockUser1.sub) {
              return mockUser1;
            } else {
              return 'Wrong param to User.findOne!';
            }
          },
        };
      });

    return graphql(schema, query, {}, {}).then((result) => {
      console.log(userFindOneSpy.mock.calls);
      expect(result).not.toBe(null);
      expect(result.data).toEqual({ user: mockUser1 });
    });
  });

  it('creates and returns appropriate user when there is no existing user', () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          user: UserField,
        },
      }),
    });

    const mockUser1 = {
      email: 'e@mail.com',
      sub: 'fakeSubID',
      firstName: 'Jonathan',
      lastName: 'Taylor',
    };

    const query = `{
      user(sub: "${mockUser1.sub}", email: "${mockUser1.email}", firstName: "${mockUser1.firstName}", lastName: "${mockUser1.lastName}") {
        email
        sub
        firstName
        lastName
      }
    }`;

    const userFindOneSpy = jest
      .spyOn(User, 'findOne')
      .mockImplementation((searchParams) => {
        return {
          exec: () => {
            // Return null user upon findOne execution
            return null;
          },
        };
      });

    const userCreateSpy = jest
      .spyOn(User, 'create')
      .mockImplementation((createParams) => {
        return {
          exec: () => {
            return createParams;
          },
        };
      });

    return graphql(schema, query, {}, {}).then((result) => {
      console.log(userCreateSpy.mock.calls);
      expect(result).not.toBe(null);
      expect(result.data).toEqual({ user: mockUser1 });
    });
  });
});

// describe('add user mutation', () => {
//   it('adds user and returns appropriate user information', () => {
//     const schema = new GraphQLSchema({
//       query: new GraphQLObjectType({
//         name: 'Mutation',
//         fields: {
//           addUser: addUserField,
//         },
//       }),
//     });
//     const mockUser1 = {
//       id: '8675309',
//       email: 'test@help.com',
//       sub: 'fakeSub',
//       firstName: 'testy',
//       lastName: 'mctestface',
//       createdAt: `${Date.now()}`,
//     };

//     const query = `{
//       users (email: "${mockUser1.email}", sub: "${mockUser1.sub}", firstName: "${mockUser1.firstName}", lastName: "${mockUser1.lastName}") {
//         email
//         sub
//         firstName
//         lastName
//       }
//     }`;

//     jest
//       .spyOn(User, 'save')
//       .mockReturnValue(Promise.resolve(mockUser1))
//     ;

//     return graphql(schema, query, {}, {}).then((result) => {
//       expect(result).not.toBe(null);
//       expect(result.data).toEqual({
//         users: mockUser1,
//       });
//     });
//   });
// });

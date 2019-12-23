const { graphql, GraphQLObjectType, GraphQLSchema } = require('graphql');
const User = require('../models/user');
const {
  UsersField,
  UserField,
  addUserField,
  isSharingLocationField,
} = require('../schema/users');

afterEach(() => {
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
        firstName
        lastName
        createdAt
      }
    }`;
    const mockUser1 = {
      id: '8675309',
      email: 'test@help.com',
      firstName: 'testy',
      lastName: 'mctestface',
      createdAt: `${Date.now()}`,
    };
    const mockUser2 = {
      id: 'pain',
      email: 'graphql@sucks.com',
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
      firstName: 'testy2',
      lastName: 'mctestface2',
      createdAt: `${Date.now()}`,
    };

    const query = `{
      user(email: "${mockUser1.email}") {
        id
        email
        firstName
        lastName
        createdAt
      }
    }`;

    jest.spyOn(User, 'findOne').mockImplementation((searchParams) => {
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
      firstName: 'Jonathan',
      lastName: 'Taylor',
    };

    const query = `{
      user(email: "${mockUser1.email}", firstName: "${mockUser1.firstName}", lastName: "${mockUser1.lastName}") {
        email
        firstName
        lastName
      }
    }`;

    jest.spyOn(User, 'findOne').mockImplementation(() => {
      return {
        exec: () => {
          // Return null user upon findOne execution
          return null;
        },
      };
    });

    jest.spyOn(User, 'create').mockImplementation((createParams) => {
      return createParams;
    });

    return graphql(schema, query, {}, {}).then((result) => {
      expect(result).not.toBe(null);
      expect(result.data).toEqual({ user: mockUser1 });
    });
  });
});

describe('add user mutation', () => {
  it('adds user and returns appropriate user information', () => {
    const schema = new GraphQLSchema({
      // The entire query block is just to appease graphql validation
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          addUser: addUserField,
        },
      }),
    });
    const mockUser1 = {
      id: 'someID',
      email: 'test@help.com',
      isSharingLocation: true,
      firstName: 'testy',
      lastName: 'mctestface',
      createdAt: `${Date.now()}`,
    };

    const query = `
      {
        addUser(email: "${mockUser1.email}", firstName: "${mockUser1.firstName}", lastName: "${mockUser1.lastName}"){
          id
          firstName
          lastName
          isSharingLocation
          email
          createdAt
        }
      }
    `;

    jest.spyOn(User, 'create').mockImplementation(() => {
      return mockUser1;
    });

    return graphql(schema, query, {}, {}).then((result) => {
      expect(result).not.toBe(null);
      expect(result.data).toEqual({
        addUser: mockUser1,
      });
    });
  });
});

describe('updateIsSharingLocation mutation', () => {
  it('updates isSharing field and returns the appropriate user', () => {
    const schema = new GraphQLSchema({
      // The entire query block is just to appease graphql validation
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          updateIsSharingLocation: isSharingLocationField,
        },
      }),
    });
    const mockUser1 = {
      id: 'someID',
      email: 'test@help.com',
      isSharingLocation: true,
      firstName: 'testy',
      lastName: 'mctestface',
      createdAt: `${Date.now()}`,
    };

    const query = `
      {
        updateIsSharingLocation(id: "${mockUser1.id}", isSharingLocation: ${mockUser1.isSharingLocation}){
          id
          isSharingLocation
        }
      }
    `;

    const userUpdateSpy = jest
      .spyOn(User, 'findByIdAndUpdate')
      .mockImplementation(() => {
        return {
          exec: () => {
            return mockUser1;
          },
        };
      });

    return graphql(schema, query, {}, {}).then((result) => {
      expect(result).not.toBe(null);
      expect(result.data).toEqual({
        updateIsSharingLocation: {
          id: mockUser1.id,
          isSharingLocation: mockUser1.isSharingLocation,
        },
      });
      expect(userUpdateSpy.mock.calls[0][0]).toEqual(mockUser1.id);
      expect(userUpdateSpy.mock.calls[0][1]).toEqual({
        isSharingLocation: mockUser1.isSharingLocation,
      });
    });
  });
});

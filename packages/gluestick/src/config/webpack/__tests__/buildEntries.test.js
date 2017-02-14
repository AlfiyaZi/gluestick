jest.mock('../../../generator', () => jest.fn());
jest.mock('entries.json', () => ({
  '/': {
    component: 'path/to/main/component',
    routes: 'path/to/main/routes',
    reducers: 'path/to/main/reducers',
  },
  '/home': {
    component: 'path/to/home/component',
    routes: 'path/to/home/routes',
    reducers: 'path/to/home/reducers',
  },
}), { virtual: true });
jest.mock('glob', () => ({
  sync: jest.fn(() => ['path/to/main/entry.js']),
}));

const path = require('path');
const buildEntries = require('../buildEntries');
const defaultGSConfig = require('../../defaults/glueStickConfig');
const generate = require('../../../generator');

const originalPath = path.join.bind({});

describe('config/webpack/buildEntries', () => {
  beforeEach(() => {
    path.join = jest.fn().mockImplementation(
      () => 'entries.json',
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
    path.join = originalPath;
  });

  it('should build client entries', () => {
    expect(buildEntries(defaultGSConfig, {})).toEqual({
      entry: 'path/to/main/entry.js',
    });
    expect(generate.mock.calls[0]).toEqual([{
      generatorName: 'clientEntryInit',
      entityName: 'main',
      options: {
        routes: 'path/to/main/routes',
        clientEntryInitPath: defaultGSConfig.clientEntryInitPath,
      },
    }, {}]);
    expect(generate.mock.calls[1]).toEqual([{
      generatorName: 'clientEntryInit',
      entityName: 'home',
      options: {
        routes: 'path/to/home/routes',
        clientEntryInitPath: defaultGSConfig.clientEntryInitPath,
      },
    }, {}]);
  });
});

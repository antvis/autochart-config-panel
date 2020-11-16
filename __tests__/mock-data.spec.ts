import { mock } from '../src/mock-data';

test('one enum', () => {
  expect(
    mock([{ type: 'enum', values: ['A', 'B', 'C'], name: 'c1', distribution: 'cartesian' }], 10).map(item => item.c1)
  ).toEqual(['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C', 'A']);
});

test('two enum', () => {
  expect(
    mock(
      [
        { type: 'enum', values: ['A', 'B', 'C'], name: 'c1', distribution: 'cartesian' },
        { type: 'enum', values: ['a', 'b', 'c'], name: 'c2', distribution: 'cartesian' },
      ],
      10
    ).map(item => `${item.c1}${item.c2}`)
  ).toEqual(['Aa', 'Ab', 'Ac', 'Ba', 'Bb', 'Bc', 'Ca', 'Cb', 'Cc', 'Aa']);
});

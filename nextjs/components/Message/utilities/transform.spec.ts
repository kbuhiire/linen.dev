import transform from './transform';

describe('transport', () => {
  it('transforms code tokens to pre tokens if they contain newlines', () => {
    const tree = {
      type: 'root',
      children: [
        {
          type: 'code',
          value: 'foo\nbar',
          source: 'foo\nbar',
        },
      ],
      source: 'foo\nbar',
    };
    const output = transform(tree);

    expect(output).toEqual(
      expect.objectContaining({
        type: 'root',
        children: [
          expect.objectContaining({
            type: 'pre',
            value: 'foo\nbar',
            source: 'foo\nbar',
          }),
        ],
        source: 'foo\nbar',
      })
    );
  });
});

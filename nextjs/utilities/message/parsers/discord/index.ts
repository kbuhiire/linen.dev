// Discord uses the `Markdown101` format.
// https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-

import parse from '../parse';
import { explicit, regexp, deep, shallow, root } from '../combinators';

const bold = explicit(
  regexp(
    /^\*\*(\S([^**\n]*?|[^**\n]*? `.*?` )\S|\S)\*\*(?=[\s.,\])}!?\-=]|$)/,
    deep('bold', (content: string) => parse(content, matchers))
  )
);

const italic1 = explicit(
  regexp(
    /^_(\S([^_\n]*?|[^_\n]*? `.*?` )\S|\S)_(?=[\s.,\])}!?\-=]|$)/,
    deep('italic', (content: string) => parse(content, matchers))
  )
);

const italic2 = explicit(
  regexp(
    /^\*(\S([^*\n]*?|[^*\n]*? `.*?` )\S|\S)\*(?=[\s.,\])}!?\-=]|$)/,
    deep('italic', (content: string) => parse(content, matchers))
  )
);

const underline = explicit(
  regexp(
    /^__(\S([^__\n]*?|[^__\n]*? `.*?` )\S|\S)__(?=[\s.,\])}!?\-=]|$)/,
    deep('underline', (content: string) => parse(content, matchers))
  )
);

const strike = explicit(
  regexp(
    /^~~(\S([^~~\n]*?|[^~~\n]*? `.*?` )\S|\S)~~(?=[\s.,\])}!?\-=]|$)/,
    deep('strike', (content: string) => parse(content, matchers))
  )
);

const spoiler = explicit(
  regexp(
    /^\|\|(\S([^||\n]*?|[^||\n]*? `.*?` )\S|\S)\|\|(?=[\s.,\])}!?\-=]|$)/,
    deep('spoiler', (content: string) => parse(content, matchers))
  )
);

const code = explicit(
  regexp(/^`([^`]+?)`(?=[\s.,\])}!?\-=]|$)/, shallow('code'))
);

const pre = explicit(
  regexp(/^```(\s*\S[\s\S]*?\s*)```(?=[\s.,\])}!?\-=]|$)/, shallow('pre'))
);

const link1 = explicit(
  regexp(
    /^((https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])(?=[\s.,\])}!?\-=]|$)/gi,
    (match: [string, string], _: string, position: number) => {
      const [result, content] = match;

      return [
        {
          type: 'url',
          url: result,
          value: result,
          source: result,
        },
        position + result.length,
      ];
    }
  )
);

const link2 = explicit(
  regexp(
    /^(mailto:[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])(?=[\s.,\])}!?\-=]|$)/gi,
    (match: [string, string], _: string, position: number) => {
      const [result, content] = match;

      return [
        {
          type: 'url',
          url: result,
          value: result,
          source: result,
        },
        position + result.length,
      ];
    }
  )
);

const link3 = regexp(
  /^<([^\s<>][^\n<>]*?)(\|([^<>]+?))?>/,
  (match: [string, string, string, string], text: string, position: number) => {
    const [result, link, _, label] = match;
    const next = position + result.length;
    const labels = label ? parse(label, matchers) : undefined;

    switch (link[0]) {
      case '@':
        return [
          {
            type: 'user',
            id: link.slice(1),
            label: labels,
            source: result,
          },
          next,
        ];
      case '#':
        return [
          {
            type: 'channel',
            id: link.slice(1),
            label: labels,
            value: link.slice(1) + (label ? `|${label}` : ''),
            source: result,
          },
          next,
        ];
      default:
        return [
          {
            type: 'url',
            url: link,
            label: labels,
            value: link + (label ? `|${label}` : ''),
            source: result,
          },
          next,
        ];
    }
  }
);

const matchers = [
  underline,
  bold,
  italic1,
  italic2,
  strike,
  pre,
  code,
  spoiler,
  link1,
  link2,
  link3,
];

export default function (input: string) {
  return root(input, parse(input, matchers));
}

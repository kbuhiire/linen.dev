import type { Settings } from 'serializers/account/settings';

export default function createSettings(options?: object): Settings {
  return {
    communityId: '1234',
    communityName: 'foo',
    communityType: 'linen',
    brandColor: 'black',
    homeUrl: 'https://foo.com',
    docsUrl: 'https://foo.com/docs',
    logoUrl: 'https://foo.com/assets/images/logo.svg',
    name: 'foo',
    communityUrl: 'https://foo.com/community',
    communityInviteUrl: '',
    ...options,
  };
}

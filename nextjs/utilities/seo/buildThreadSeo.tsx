import { capitalize, cleanUpStringForSeo } from 'utilities/string';
import { Settings } from 'serializers/account/settings';
import { SerializedMessage } from 'serializers/message';
import { LINEN_URL } from '../../constants';

export function buildThreadSeo({
  isSubDomainRouting,
  channelName,
  messages,
  settings,
  threadId,
  slug,
}: {
  isSubDomainRouting: boolean;
  channelName: string;
  messages: SerializedMessage[];
  settings: Settings;
  threadId: string;
  slug: string;
}) {
  const cleanBody = cleanUpStringForSeo(messages?.[0]?.body || slug);
  const title = [
    cleanBody.slice(0, 60),
    capitalize(channelName),
    capitalize(settings.communityName),
  ]
    .filter(Boolean)
    .join(' | ');

  let url = isSubDomainRouting
    ? `https://${settings.redirectDomain}/t/${threadId}`
    : `${LINEN_URL}/${settings.prefix}/${settings.communityName}/t/${threadId}`;

  if (slug) {
    url += '/' + slug.toLowerCase();
  }

  return {
    title,
    description: cleanBody.slice(0, 200),
    image: settings.logoUrl,
    url,
  };
}

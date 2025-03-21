import PageLayout from '../../layout/PageLayout';
import { ChannelViewProps } from '.';
import { Channel, ChannelForBots } from 'components/Channel';
import { buildChannelSeo } from 'utilities/seo';
import { ChannelSerialized } from 'lib/channel';

export default function ChannelPage({
  threads,
  pinnedThreads,
  channels,
  currentChannel,
  currentCommunity,
  settings,
  channelName,
  isSubDomainRouting,
  nextCursor,
  pathCursor,
  isBot,
  permissions,
}: ChannelViewProps) {
  // reusing the type between few layers causes problems
  // we should explicitly define the type per component
  if (!threads) {
    return <div />;
  }

  const ComponentToRender = isBot ? ChannelForBots : Channel;

  return (
    <PageLayout
      currentChannel={currentChannel}
      seo={{
        ...buildChannelSeo({
          settings,
          channelName,
          isSubDomainRouting,
          pathCursor,
          threads,
        }),
      }}
      channels={channels as ChannelSerialized[]}
      settings={settings}
      isSubDomainRouting={isSubDomainRouting}
      permissions={permissions}
    >
      <ComponentToRender
        threads={threads}
        pinnedThreads={pinnedThreads}
        currentChannel={currentChannel}
        currentCommunity={currentCommunity}
        settings={settings}
        channelName={channelName}
        isSubDomainRouting={isSubDomainRouting}
        nextCursor={nextCursor}
        pathCursor={pathCursor}
        isBot={isBot}
        permissions={permissions}
        key={settings.communityName + channelName}
      />
    </PageLayout>
  );
}

// Scenarios
// When it is mobile screen and no thread we show the main messages
// When it is mobile screen and there is thread we show the thread
// When it is mobile screen and there is a thread showing if we click on the back button it goes back to the main thread

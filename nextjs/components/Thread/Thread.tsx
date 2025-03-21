import { useEffect } from 'react';
import { ThreadState } from '@prisma/client';
import Header from './Header';
import Messages from './Messages';
import JoinChannelLink from 'components/Link/JoinChannelLink';
import { SerializedThread } from 'serializers/thread';
import { SerializedUser } from 'serializers/user';
import type { Settings } from 'serializers/account/settings';
import MessageForm from 'components/MessageForm';
import { fetchMentions } from 'components/MessageForm/api';
import { Permissions } from 'types/shared';
import { Mode } from 'hooks/mode';
import styles from './index.module.scss';
import classNames from 'classnames';

interface Props {
  thread: SerializedThread;
  channelId: string;
  channelName: string;
  threadUrl?: string | null;
  isSubDomainRouting: boolean;
  settings: Settings;
  permissions: Permissions;
  currentUser: SerializedUser | null;
  mode?: Mode;
  sendMessage({
    message,
    channelId,
    threadId,
  }: {
    message: string;
    channelId: string;
    threadId: string;
  }): Promise<void>;
  updateThread({ state, title }: { state?: ThreadState; title?: string }): void;
  onClose?(): void;
  onSend?(): void;
  onMount?(): void;
  onReaction?({
    threadId,
    messageId,
    type,
    active,
  }: {
    threadId: string;
    messageId: string;
    type: string;
    active: boolean;
  }): void;
}

export function Thread({
  thread,
  channelId,
  channelName,
  threadUrl,
  isSubDomainRouting,
  settings,
  permissions,
  currentUser,
  mode,
  sendMessage,
  updateThread,
  onClose,
  onSend,
  onMount,
  onReaction,
}: Props) {
  const { id, state, viewCount, incrementId } = thread;
  useEffect(() => {
    onMount?.();
  }, []);

  useEffect(() => {
    fetch(`/api/count?incrementId=${incrementId}`, { method: 'PUT' });
  }, [incrementId]);

  function isThreadCreator(
    currentUser: SerializedUser | null,
    thread: SerializedThread
  ): boolean {
    const creator = thread.messages[0].author;
    if (!currentUser || !creator) {
      return false;
    }
    return currentUser.id === creator.id;
  }

  const manage = permissions.manage || isThreadCreator(currentUser, thread);

  return (
    <div
      className={classNames(styles.container, {
        [styles.dimmed]: mode === Mode.Drag,
      })}
    >
      <Header
        thread={thread}
        channelName={channelName}
        onClose={onClose}
        onCloseThread={() => updateThread({ state: ThreadState.CLOSE })}
        onReopenThread={() => updateThread({ state: ThreadState.OPEN })}
        onSetTitle={(title) => updateThread({ title })}
        manage={manage}
      />
      <div className={styles.thread}>
        <Messages
          thread={thread}
          permissions={permissions}
          isSubDomainRouting={isSubDomainRouting}
          currentUser={currentUser}
          settings={settings}
          onReaction={onReaction}
        />

        <div className={styles.footer}>
          <div className={styles.count}>
            <span className={styles.subtext}>View count:</span> {viewCount + 1}
          </div>
          {threadUrl && (
            <JoinChannelLink
              href={threadUrl}
              communityType={settings.communityType}
            />
          )}
        </div>
      </div>
      {permissions.chat && (
        <div className={styles.chat}>
          {manage && state === ThreadState.OPEN ? (
            <MessageForm
              autoFocus
              onSend={(message: string) => {
                onSend?.();
                return sendMessage({ message, channelId, threadId: id });
              }}
              onSendAndClose={(message: string) => {
                onSend?.();
                return Promise.all([
                  sendMessage({ message, channelId, threadId: id }),
                  updateThread({ state: ThreadState.CLOSE }),
                ]);
              }}
              fetchMentions={(term?: string) => {
                if (!term) return Promise.resolve([]);
                return fetchMentions(term, settings.communityId);
              }}
            />
          ) : (
            <MessageForm
              autoFocus
              onSend={(message: string) => {
                onSend?.();
                return Promise.all([
                  sendMessage({ message, channelId, threadId: id }),
                  manage && updateThread({ state: ThreadState.OPEN }),
                ]);
              }}
              fetchMentions={(term?: string) => {
                if (!term) return Promise.resolve([]);
                return fetchMentions(term, settings.communityId);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

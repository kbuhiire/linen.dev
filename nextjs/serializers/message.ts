import { MessageForSerialization } from '../types/partialTypes';
import { SerializedAttachment } from '../types/shared';
import serializeUser, { SerializedUser } from 'serializers/user';
import serializeReaction, { SerializedReaction } from 'serializers/reaction';
import type {
  users,
  mentions,
  messageAttachments,
  messageReactions,
  MessageFormat,
} from '@prisma/client';

export interface SerializedMessage {
  id: string;
  body: string;
  sentAt: string;
  usersId: string;
  mentions: SerializedUser[];
  attachments: SerializedAttachment[];
  reactions: SerializedReaction[];
  threadId: string;
  externalId?: string;
  author?: users;
  messageFormat: MessageFormat;
}

function serializeAttachment(
  attachment: messageAttachments
): SerializedAttachment {
  return {
    url: attachment.internalUrl as string,
    name: attachment.name,
  };
}

type MentionsForSerialization = mentions & { users?: users };

function serializeMentions(
  mentions?: MentionsForSerialization[]
): SerializedUser[] {
  if (!mentions) {
    return [];
  }
  return mentions
    .filter((mention: MentionsForSerialization) => mention.users)
    .map((mention: MentionsForSerialization) =>
      serializeUser(mention.users as users)
    );
}

export function serializeMessage(
  message: MessageForSerialization
): SerializedMessage {
  return {
    id: message.id,
    externalId: message.externalMessageId,
    threadId: message.threadId,
    body: message.body,
    sentAt: message.sentAt.toString(),
    author: message.author,
    usersId: message.usersId,
    messageFormat: message.messageFormat,
    mentions: serializeMentions(message.mentions),
    attachments:
      message.attachments
        ?.filter(({ internalUrl }: messageAttachments) => Boolean(internalUrl))
        ?.map(serializeAttachment) || [],
    reactions:
      message.reactions
        ?.filter(
          (reaction: messageReactions) =>
            typeof reaction.count === 'number' && reaction.count > 0
        )
        ?.map(serializeReaction) || [],
  };
}

export default serializeMessage;

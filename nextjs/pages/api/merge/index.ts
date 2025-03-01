import { NextApiRequest, NextApiResponse } from 'next/types';
import prisma from 'client';
import Permissions from 'services/permissions';
import CommunityService from 'services/community';

export async function create({
  from,
  to,
  communityId,
}: {
  from: string;
  to: string;
  communityId: string;
}) {
  if (!from || !to) {
    return { status: 400 };
  }

  const community = await CommunityService.find({ communityId });

  if (!community) {
    return { status: 403 };
  }

  const thread1 = await prisma.threads.findUnique({
    where: { id: from },
    include: { messages: true, channel: true },
  });
  const thread2 = await prisma.threads.findUnique({
    where: { id: to },
    include: { channel: true },
  });
  if (!thread1 || !thread2) {
    return {
      status: 403,
    };
  }

  if (
    thread1.channel.accountId !== communityId ||
    thread2.channel.accountId !== communityId
  ) {
    return { status: 403 };
  }

  const ids = thread1.messages.map((message) => message.id);

  await prisma.$transaction([
    prisma.messages.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        threadId: thread2.id,
      },
    }),
    prisma.threads.delete({
      where: {
        id: thread1.id,
      },
    }),
  ]);

  return {
    status: 200,
    data: {},
  };
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { communityId } = request.body;
  const permissions = await Permissions.get({
    request,
    response,
    params: { communityId },
  });

  if (!permissions.manage) {
    return response.status(401).json({});
  }

  if (request.method === 'POST') {
    const { from, to } = request.body;
    const { status, data } = await create({ from, to, communityId });
    return response.status(status).json(data || {});
  }
  return response.status(200).json({});
}

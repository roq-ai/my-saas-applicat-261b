import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { walletValidationSchema } from 'validationSchema/wallets';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getWallets();
    case 'POST':
      return createWallet();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getWallets() {
    const data = await prisma.wallet
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'wallet'));
    return res.status(200).json(data);
  }

  async function createWallet() {
    await walletValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.transaction?.length > 0) {
      const create_transaction = body.transaction;
      body.transaction = {
        create: create_transaction,
      };
    } else {
      delete body.transaction;
    }
    const data = await prisma.wallet.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}

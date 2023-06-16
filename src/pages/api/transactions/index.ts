import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { transactionValidationSchema } from 'validationSchema/transactions';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getTransactions();
    case 'POST':
      return createTransaction();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTransactions() {
    const data = await prisma.transaction
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'transaction'));
    return res.status(200).json(data);
  }

  async function createTransaction() {
    await transactionValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.transaction.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}

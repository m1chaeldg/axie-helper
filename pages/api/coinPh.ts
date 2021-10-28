// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const coinPhData = await axios.get(
    `https://quote.coins.ph/v3/markets?region=PH`
  );

  res.status(coinPhData.status).json(coinPhData.data);
}

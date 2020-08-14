import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome } = transactions
      .map(transaction =>
        transaction.type === 'income'
          ? { income: Number(transaction.value) }
          : { outcome: Number(transaction.value) },
      )
      .reduce(
        (acc, cur) => ({
          income: acc.income + (cur.income || 0),
          outcome: acc.outcome + (cur.outcome || 0),
        }),
        { income: 0, outcome: 0 },
      );

    const balance = { income, outcome, total: income - outcome } as Balance;
    return balance;
  }
}

export default TransactionsRepository;

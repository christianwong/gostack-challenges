import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const { income, outcome } = this.transactions
      .map(transaction =>
        transaction.type === 'income'
          ? { income: transaction.value, outcome: 0 }
          : { income: 0, outcome: transaction.value },
      )
      .reduce((acc, cur) => ({
          income: acc.income + cur.income,
          outcome: acc.outcome + cur.outcome,
        }),
        { income: 0, outcome: 0 },
      );

    const balance = { income, outcome, total: income - outcome } as Balance;
    return balance;
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    const balance = this.getBalance();
    if (type === 'outcome' && value >= balance.total) {
      throw Error("you don't have all that money!");
    }

    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;

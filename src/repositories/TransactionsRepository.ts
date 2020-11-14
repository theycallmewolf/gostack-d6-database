import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(all: Transaction[]): Promise<Balance> {
    let totalIncome = 0;
    let totalOutcome = 0;

    const incomeTransactions = all.filter(
      (item: { type: string }) => item.type === 'income',
    );

    const outcomeTransactions = all.filter(
      (item: { type: string }) => item.type === 'outcome',
    );

    incomeTransactions.forEach(transaction => {
      totalIncome += transaction.value;
    });

    outcomeTransactions.forEach(transaction => {
      totalOutcome += transaction.value;
    });

    const balance = {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalIncome - totalOutcome,
    };

    return balance;
  }
}

export default TransactionsRepository;

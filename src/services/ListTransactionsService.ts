import { getCustomRepository, getRepository } from 'typeorm';
import TransactionsRepo from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface TransactionsWithCategories {
  id: string;
  title: string;
  type: 'income' | 'outcome';
  value: number;
  created_at: Date;
  updated_at: Date;
  category: Category | undefined;
}
interface TransactionsList {
  transactions: TransactionsWithCategories[];
  balance: {
    income: number;
    outcome: number;
    total: number;
  };
}

class ListTransactionsService {
  public async execute(): Promise<TransactionsList> {
    //
    const transactionsRepo = getCustomRepository(TransactionsRepo);
    const transactions = await transactionsRepo.find();

    //
    const categoriesRepository = getRepository(Category);
    const categories = await categoriesRepository.find();

    const transactionsWithCategories: TransactionsWithCategories[] = [];

    transactions.forEach(transaction => {
      transactionsWithCategories.push({
        id: transaction.id,
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        created_at: transaction.created_at,
        updated_at: transaction.updated_at,
        category: categories.find(
          category => transaction.category_id === category.id,
        ),
      });
    });

    //
    const balance = await transactionsRepo.getBalance(transactions);
    const transactionsList = {
      transactions: transactionsWithCategories,
      balance,
    };

    return transactionsList;
  }
}

export default ListTransactionsService;

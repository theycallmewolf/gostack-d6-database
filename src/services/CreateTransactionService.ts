import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepo from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepo = getCustomRepository(TransactionsRepo);
    const createCategory = new CreateCategoryService();

    const all = await transactionsRepo.find();
    const balance = await transactionsRepo.getBalance(all);

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('not enough credit');
    }

    const newCategory = await createCategory.execute(category);

    const transaction = transactionsRepo.create({
      title,
      value,
      type,
      category_id: newCategory.id,
    });

    await transactionsRepo.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

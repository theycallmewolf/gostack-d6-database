import CSVToJSON from 'csvtojson';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(file: string): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();

    let transactions = [];

    try {
      transactions = await CSVToJSON().fromFile(file);

      // eslint-disable-next-line no-restricted-syntax
      for (const transaction of transactions) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const a = await createTransaction.execute(transaction);
          console.log(a);
        } catch (e) {
          console.log(e);
        }
      }
    } catch {
      throw new AppError('invalid file');
    }

    return transactions;
  }
}

export default ImportTransactionsService;

/* eslint-disable no-console */
import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import TransactionsRepo from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import ListTransactionsService from '../services/ListTransactionsService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import uploadConfig from '../config/upload';
// import DeleteTransactionService from '../services/DeleteTransactionService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const listTransactions = new ListTransactionsService();
  const all = await listTransactions.execute();
  return response.json(all);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();
  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const transactionsRepo = getCustomRepository(TransactionsRepo);
  await transactionsRepo.delete(id);
  return response.status(200).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransaction = new ImportTransactionsService();
    const { file } = request;
    const filePath = file.path;
    const transactionList = await importTransaction.execute(filePath);
    return response.json(transactionList);
  },
);

export default transactionsRouter;

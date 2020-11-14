/* eslint-disable no-console */
import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import TransactionsRepo from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import ListTransactionsService from '../services/ListTransactionsService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

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

// transactionsRouter.post('/import', async (request, response) => {
//   // TODO
// });

export default transactionsRouter;

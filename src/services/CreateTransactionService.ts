import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);
    const { income } = await transactionRepository.getBalance();

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError(
        'The informed type is invalid. Expected is income or outcome.',
      );
    }

    if (type === 'outcome' && value > income) {
      throw new AppError('You do not have enough balance.');
    }

    const categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryExists) {
      const newCategory = await categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(newCategory);

      const transaction = await transactionRepository.create({
        title,
        type,
        value,
        category_id: newCategory.id,
      });

      await transactionRepository.save(transaction);

      return transaction;
    }

    const transaction = await transactionRepository.create({
      title,
      type,
      value,
      category_id: categoryExists.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

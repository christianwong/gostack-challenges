import csvParse from 'csv-parse';
import fs from 'fs';
import { getCustomRepository, getRepository, In } from 'typeorm';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface FileTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const readStream = fs.createReadStream(filePath);

    const parser = csvParse({
      from_line: 2,
    });

    const parsedCSV = readStream.pipe(parser);

    const transactions: FileTransaction[] = [];
    const categories: string[] = [];

    parsedCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parsedCSV.on('end', resolve));

    const existingCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    const existingCategoriesTitle = existingCategories.map(
      (category: Category) => category.title,
    );

    const newCategoryTitles = categories
      .filter(category => !existingCategoriesTitle.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      newCategoryTitles.map(title => ({ title })),
    );

    await categoriesRepository.save(newCategories);

    const savedCategories = [...newCategories, ...existingCategories];

    const newTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: savedCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(newTransactions);

    await fs.promises.unlink(filePath);

    return newTransactions;
  }
}

export default ImportTransactionsService;

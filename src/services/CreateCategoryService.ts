import { getRepository } from 'typeorm';
import Category from '../models/Category';

interface Cat {
  categoryNormalized: string;
}

class CreateCategoryService {
  public async execute(categoryNormalized: string): Promise<Category> {
    const categoriesRepository = getRepository(Category);

    const checkIfCategoryExists = await categoriesRepository.findOne({
      where: { title: categoryNormalized },
    });

    let useCategory;

    if (!checkIfCategoryExists) {
      const newCategory = categoriesRepository.create({
        title: categoryNormalized,
      });
      useCategory = await categoriesRepository.save(newCategory);
    } else {
      useCategory = checkIfCategoryExists;
    }

    return useCategory;
  }
}

export default CreateCategoryService;

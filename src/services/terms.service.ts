import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Terms } from '../entities/terms.entity';
import { NotFoundError } from '../helpers/errors.helper';

export class TermsService {
  private termsRepository: Repository<Terms>;

  constructor() {
    this.termsRepository = AppDataSource.getRepository(Terms);
  }

  // GET TERMS OF SERVICE
  async getTermsOfService(): Promise<Terms[]> {
    const terms = await this.termsRepository.find();

    if (!terms) {
      throw new NotFoundError('Terms of service not found');
    }
    return terms;
  }

  // CREATE TERMS OF SERVICE
  async createTermsOfService({
    termsOfService,
  }: {
    termsOfService: string;
  }): Promise<Terms> {
    const terms = this.termsRepository.create({
      termsOfService,
    });
    await this.termsRepository.save(terms);

    return terms;
  }
}

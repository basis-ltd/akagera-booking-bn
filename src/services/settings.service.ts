import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Settings } from '../entities/settings.entity';
import { NotFoundError } from '../helpers/errors.helper';

export class SettingsService {
  private settingsRepository: Repository<Settings>;

  constructor() {
    this.settingsRepository = AppDataSource.getRepository(Settings);
  }

  // SET USD RATE
  async setUsdRate({ usdRate }: { usdRate: number }): Promise<Settings> {
    // FIND SETTINGS
    let settings = await this.settingsRepository.findOne({
      where: usdRate as any,
    });
    if (!settings) {
      settings = new Settings();
    }

    // SET USD RATE
    settings.usdRate = usdRate;

    // SAVE SETTINGS
    return this.settingsRepository.save(settings);
  }
}

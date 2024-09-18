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
    let settings = await this.settingsRepository.find();
    let newSettings = undefined;
    if (settings?.length <= 0) {
      newSettings = new Settings();
    } else {
      newSettings = settings[0];
      newSettings.usdRate = usdRate;
    }

    // SAVE SETTINGS
    return this.settingsRepository.save(newSettings);
  }

  // GET USD RATE
  async getUsdRate(): Promise<Settings> {
    // FIND SETTINGS
    const settings = await this.settingsRepository.find({
      order: {
        updatedAt: 'DESC',
      },
    });

    if (settings?.length <= 0) {
      throw new NotFoundError('USD rate not found!');
    }

    return settings?.[0];
  }
}

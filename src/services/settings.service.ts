import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Settings } from '../entities/settings.entity';
import { NotFoundError } from '../helpers/errors.helper';
import logger from '../helpers/logger.helper';
import { usdRateUpdateEmailTemplate } from '../helpers/emails.helper';
import { sendEmail } from '../helpers/emails.helper';
import { UUID } from 'crypto';
import { UserService } from './user.service';

// ENVIRONMENT VARIABLES
const { SENDGRID_SEND_FROM, ADMIN_EMAIL = 'akagera@africanparks.org' } =
  process.env;

// INITIALIZE USER SERVICE
const userService = new UserService();

export class SettingsService {
  private settingsRepository: Repository<Settings>;

  constructor() {
    this.settingsRepository = AppDataSource.getRepository(Settings);
  }

  // SET USD RATE
  async setUsdRate({
    usdRate,
    userId,
  }: {
    usdRate: number;
    userId: UUID;
  }): Promise<Settings> {
    // CHECK IF USER IS ADMIN
    const userExists = await userService.getUserById(userId);

    // IF USER DOES NOT EXIST
    if (!userExists) {
      throw new NotFoundError('User not found!');
    }

    // FIND SETTINGS
    let settings = await this.settingsRepository.find({
      select: ['usdRate', 'adminEmail', 'userId'],
      order: {
        updatedAt: 'DESC',
      },
      relations: ['user'],
    });
    let newSettings = undefined;
    if (settings?.length <= 0) {
      newSettings = new Settings();
    } else {
      newSettings = settings[0];
    }
    newSettings.usdRate = usdRate;
    newSettings.userId = userId;
    newSettings.createdAt = new Date();
    newSettings.updatedAt = new Date();

    logger.warn(`USD rate set to ${usdRate}`);

    // SEND EMAIL
    sendEmail(
      String(ADMIN_EMAIL),
      String(SENDGRID_SEND_FROM),
      'USD Rate Update',
      usdRateUpdateEmailTemplate({
        oldRate: Number(settings?.[0].usdRate) || 0,
        newRate: usdRate,
        updatedBy: userExists,
      })
    );

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
      relations: ['user'],
    });

    if (settings?.length <= 0) {
      throw new NotFoundError('USD rate not found!');
    }

    return settings[0];
  }

  // UPDATE ADMIN EMAIL
  async updateAdminEmail({
    adminEmail,
    userId,
  }: {
    adminEmail: string;
    userId: UUID;
  }): Promise<Settings> {
    // CHECK IF USER IS ADMIN
    const userExists = await userService.getUserById(userId);

    // IF USER DOES NOT EXIST
    if (!userExists) {
      throw new NotFoundError('User not found!');
    }

    const settings = await this.settingsRepository.find({
      relations: ['user'],
    });

    let newSettings = undefined;
    if (settings?.length <= 0) {
      newSettings = new Settings();
    } else {
      newSettings = settings[0];
    }

    newSettings.adminEmail = adminEmail;
    newSettings.userId = userId;
    newSettings.createdAt = new Date();
    newSettings.updatedAt = new Date();

    logger.warn(`Admin email updated to ${adminEmail} by ${userExists?.email}`);

    return this.settingsRepository.save(newSettings);
  }

  // FETCH SETTINGS
  async fetchSettings(): Promise<Settings[]> {
    // FIND SETTINGS
    const settings = await this.settingsRepository.find({
      relations: ['user'],
    });

    if (settings?.length <= 0) {
      throw new NotFoundError('Settings not found!');
    }

    return settings;
  }

  // FETCH USD RATE HISTORY
  async fetchUsdRateHistory({ userId }: { userId: UUID }): Promise<Settings[]> {
    // CHECK IF USER EXISTS
    const userExists = await userService.getUserById(userId);

    // IF USER DOES NOT EXIST
    if (!userExists) {
      throw new NotFoundError('User not found!');
    }

    // FIND SETTINGS
    const settings = await this.settingsRepository.find({
      relations: ['user'],
      order: {
        updatedAt: 'DESC',
      },
    });

    if (settings?.length <= 0) {
      let settings = new Settings();
      settings.usdRate = 1300;
      settings.adminEmail = 'akagera@africanparks.org';
      settings.userId = userId;
      settings.createdAt = new Date();
      settings.updatedAt = new Date();
      await this.settingsRepository.save(settings);
      return [settings];
    }

    return settings;
  }

  // FETCH ADMIN EMAIL HISTORY
  async fetchAdminEmailHistory({
    userId,
  }: {
    userId: UUID;
  }): Promise<Settings[]> {
    // CHECK IF USER EXISTS
    const userExists = await userService.getUserById(userId);

    // IF USER DOES NOT EXIST
    if (!userExists) {
      throw new NotFoundError('User not found!');
    }

    // FIND SETTINGS
    const settings = await this.settingsRepository.find({
      select: ['adminEmail'],
      order: {
        updatedAt: 'DESC',
      },
      relations: ['user'],
    });

    if (settings?.length <= 0) {
      let settings = new Settings();
      settings.adminEmail = 'akagera@africanparks.org';
      settings.userId = userId;
      settings.createdAt = new Date();
      settings.updatedAt = new Date();
      await this.settingsRepository.save(settings);
      return [settings];
    }

    return settings;
  }

  // UPDATE SETTINGS
  async updateSettings({
    id,
    userId,
    usdRate,
    adminEmail,
  }: {
    id: UUID;
    userId: UUID;
    usdRate: number;
    adminEmail: string;
  }): Promise<Settings> {
    // CHECK IF USER EXISTS
    const userExists = await userService.getUserById(userId);

    // IF USER DOES NOT EXIST
    if (!userExists) {
      throw new NotFoundError('User not found!');
    }

    // FIND SETTINGS
    const settingsExists = await this.settingsRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });

    if (!settingsExists) {
      throw new NotFoundError('Settings not found!');
    }

    let updatedSettings = {
      ...settingsExists,
      usdRate,
      adminEmail,
      updatedAt: new Date(),
      userId,
    };

    updatedSettings = await this.settingsRepository.save(updatedSettings);

    if (settingsExists?.usdRate !== updatedSettings?.usdRate) {
      // SEND EMAIL
      sendEmail(
        settingsExists?.adminEmail,
        String(SENDGRID_SEND_FROM),
        'USD Rate Update',
        usdRateUpdateEmailTemplate({
          oldRate: settingsExists?.usdRate,
          newRate: updatedSettings?.usdRate,
          updatedBy: userExists,
        })
      );
    }

    return updatedSettings;
  }
}

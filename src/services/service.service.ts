import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Service } from '../entities/service.entity';
import { NotFoundError, ValidationError } from '../helpers/errors.helper';
import { ServicePagination } from '../types/service.types';
import { getPagination, getPagingData } from '../helpers/pagination.helper';
import { UUID } from 'crypto';
import { validateUuid } from '../helpers/validations.helper';

export class ServiceService {
  private serviceRepository: Repository<Service>;

  constructor() {
    this.serviceRepository = AppDataSource.getRepository(Service);
  }

  // CREATE SERVICE
  async createService({
    name,
    description,
    position,
  }: {
    name: string;
    description?: string;
    position?: number;
  }): Promise<Service> {
    // VALIDATE NAME
    if (!name) {
      throw new ValidationError('Name is required');
    }

    // SERVICES NUMBER
    const servicesNumber = await this.serviceRepository.count();

    // CREATE SERVICE
    const service = this.serviceRepository.create({
      name,
      description,
      position: servicesNumber + 1,
    });

    // SAVE SERVICE
    return this.serviceRepository.save(service);
  }

  // FETCH ALL SERVICES
  async fetchServices({
    size,
    page,
    condition,
  }: {
    size: number;
    page: number;
    condition: object;
  }): Promise<ServicePagination> {
    const { take, skip } = getPagination(page, size);
    const services = await this.serviceRepository.findAndCount({
      where: condition,
      take,
      skip,
      order: { position: 'ASC' },
    });

    return getPagingData(services, size, page);
  }

  // FIND SERVICE BY ID
  async findServiceById(id: UUID): Promise<Service> {
    const serviceExists = await this.serviceRepository.findOne({
      where: { id },
    });

    if (!serviceExists) {
      throw new NotFoundError('Service not found');
    }

    return serviceExists;
  }

  // GET SERVICE DETAILS
  async getServiceDetails(id: UUID): Promise<Service> {
    // VALIDATE SERVICE ID
    if (!id) {
      throw new ValidationError('Service ID is required');
    }
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid service ID');
    }

    const serviceDetails = await this.serviceRepository.findOne({
      where: { id },
    });

    if (!serviceDetails) {
      throw new NotFoundError('Service not found');
    }

    return serviceDetails;
  }

  // UPDATE SERVICE
  async updateService({
    id,
    name,
    description,
    position,
  }: {
    id: UUID;
    name: string;
    description?: string;
    position?: number;
  }): Promise<Service> {
    // VALIDATE SERVICE ID
    if (!id) {
      throw new ValidationError('Service ID is required');
    }
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid service ID');
    }

    // FIND SERVICE
    const updatedService = await this.serviceRepository.update(id, {
      name,
      description,
      position,
    });

    if (!updatedService.affected) {
      throw new NotFoundError('Service not found');
    }

    return updatedService.raw[0];
  }

  // DELETE SERVICE
  async deleteService(id: UUID): Promise<void> {
    // VALIDATE SERVICE ID
    if (!id) {
      throw new ValidationError('Service ID is required');
    }
    const { error } = validateUuid(id);

    if (error) {
      throw new ValidationError('Invalid service ID');
    }

    // DELETE SERVICE
    const deletedService = await this.serviceRepository.delete(id);

    if (!deletedService.affected) {
      throw new NotFoundError('Service not found');
    }
  }

  // COUNT SERVICES
  async countServices(): Promise<number> {
    return await this.serviceRepository.count();
  }
}

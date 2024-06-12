import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Service } from '../entities/service.entity';
import { NotFoundError, ValidationError } from '../helpers/errors.helper';
import { ServicePagination } from '../types/service.types';
import { getPagingData } from '../helpers/pagination.helper';
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
  }: {
    name: string;
    description?: string;
  }): Promise<Service> {
    // VALIDATE NAME
    if (!name) {
      throw new ValidationError('Name is required');
    }

    // CREATE SERVICE
    const service = this.serviceRepository.create({
      name,
      description,
    });

    // SAVE SERVICE
    return this.serviceRepository.save(service);
  }

  // FETCH ALL SERVICES
  async fetchServices({
    take,
    skip,
    condition,
  }: {
    take: number;
    skip: number;
    condition: object;
  }): Promise<ServicePagination> {
    const services = await this.serviceRepository.findAndCount({
      where: condition,
      take,
      skip,
    });

    return getPagingData(services, take, skip);
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
  }: {
    id: UUID;
    name: string;
    description?: string;
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
}

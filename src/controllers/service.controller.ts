import { Request, Response, NextFunction } from "express";
import { ServiceService } from "../services/service.service";
import { UUID } from "crypto";

// INITIALIZE SERVICE
const service = new ServiceService();

export const ServiceController = {
  // CREATE SERVICE
  async createService(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, position } = req.body;

      // CREATE SERVICE
      const newService = await service.createService({
        name,
        description,
        position,
      });

      // RETURN RESPONSE
      return res.status(201).json({
        message: 'Service created successfully!',
        data: newService,
      });
    } catch (error) {
      next(error);
    }
  },

  // FETCH SERVICES
  async fetchServices(req: Request, res: Response, next: NextFunction) {
    try {
      const { size = 10, page = 0, name } = req.query;
      let condition: object = {};

      // ADD NAME TO CONDITION
      if (name) {
        condition = { ...condition, name };
      }

      // FETCH SERVICES
      const services = await service.fetchServices({
        size: Number(size),
        page: Number(page),
        condition,
      });

      // RETURN RESPONSE
      return res.status(200).json({
        data: services,
      message: 'Services fetched successfully!',
      });
    } catch (error) {
      next(error);
    }
  },

  // GET SERVICE DETAILS
  async getServiceDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // GET SERVICE DETAILS
      const serviceDetails = await service.getServiceDetails(id as UUID);

      // RETURN RESPONSE
      return res.status(200).json(serviceDetails);
    } catch (error) {
      next(error);
    }
  },

  // UPDATE SERVICE
  async updateService(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, description, position } = req.body;

      // UPDATE SERVICE
      const updatedService = await service.updateService({
        id: id as UUID,
        name,
        description,
        position,
      });

      // RETURN RESPONSE
      return res.status(200).json({
        message: 'Service updated successfully!',
        data: updatedService,
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE SERVICE
  async deleteService(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // DELETE SERVICE
      await service.deleteService(id as UUID);

      // RETURN RESPONSE
      return res.status(204).json({
        message: 'Service deleted successfully!',
      });
    } catch (error) {
      next(error);
    }
  },
};

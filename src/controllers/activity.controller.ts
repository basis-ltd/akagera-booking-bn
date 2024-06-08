import { NextFunction, Request, Response } from "express";
import { ActivityService } from "../services/activity.service";

// INITIALIZE ACTIVITY SERVICE
const activityService = new ActivityService();

export const ActivityController = {

    // CREATE ACTIVITY
    async createActivity(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description, disclaimer } = req.body;

            // CREATE ACTIVITY
            const newActivity = await activityService.createActivity({
                name,
                description,
                disclaimer,
            });

            // RETURN RESPONSE
            return res.status(201).json({
                message: "Activity created successfully!",
                data: newActivity,
            });
        } catch (error: any) {
            next(error);
        }
    },

    // UPDATE ACTIVITY
    async updateActivity(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name, description, disclaimer } = req.body;

            // UPDATE ACTIVITY
            const updatedActivity = await activityService.updateActivity({
                id,
                name,
                description,
                disclaimer,
            });

            // RETURN RESPONSE
            return res.status(200).json({
                message: "Activity updated successfully!",
                data: updatedActivity,
            });
        } catch (error: any) {
            next(error);
        }
    },

    // FETCH ACTIVITIES
    async fetchActivities(req: Request, res: Response, next: NextFunction) {
        try {
          // FETCH ACTIVITIES
          const activities = await activityService.fetchActivities({});

          // RETURN RESPONSE
          return res.status(200).json({
            message: 'Activities fetched successfully!',
            data: activities,
          });
        } catch (error: any) {
            next(error);
        }
    },

    // DELETE ACTIVITY
    async deleteActivity(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            // DELETE ACTIVITY
            await activityService.deleteActivity(id);

            // RETURN RESPONSE
            return res.status(204).json({
                message: "Activity deleted successfully!",
            });
        } catch (error: any) {
            next(error);
        }
    },

    // FETCH ACTIVITY BY ID
    async fetchActivityById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            // FETCH ACTIVITY BY ID
            const activity = await activityService.findActivityById(id);

            // RETURN RESPONSE
            return res.status(200).json({
                message: "Activity fetched successfully!",
                data: activity,
            });
        } catch (error: any) {
            next(error);
        }
    },
};

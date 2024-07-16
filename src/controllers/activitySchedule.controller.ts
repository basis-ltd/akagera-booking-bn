import { Request, Response, NextFunction } from "express";
import { ActivityScheduleService } from "../services/activitySchedule.service";
import { UUID } from "crypto";

// INITIALIZE ACTIVITY SCHEDULE SERVICE
const activityScheduleService = new ActivityScheduleService();

export const ActivityScheduleController = {

    // CREATE ACTIVITY SCHEDULE
    async createActivitySchedule(req: Request, res: Response, next: NextFunction) {
        try {
            const { startTime, endTime, description, disclaimer, activityId, numberOfSeats = 1000 } = req.body;

            // CREATE ACTIVITY SCHEDULE
            const newActivitySchedule = await activityScheduleService.createActivitySchedule({
                startTime,
                endTime,
                description,
                disclaimer,
                activityId,
                numberOfSeats,
            });

            // RETURN RESPONSE
            return res.status(201).json({
                message: "Activity schedule created successfully!",
                data: newActivitySchedule,
            });
        } catch (error) {
            next(error);
        }
    },

    // FETCH ACTIVITY SCHEDULES
    async fetchActivitySchedules(req: Request, res: Response, next: NextFunction) {
        try {

            const { size = 10, page = 0, startTime, endTime, activityId } = req.query;
            let condition: object = {};

            // ADD START TIME TO CONDITION
            if (startTime) {
                condition = {...condition, startTime};
            }

            // ADD END TIME TO CONDITION
            if (endTime) {
                condition = {...condition, endTime};
            }

            // ADD ACTIVITY ID TO CONDITION
            if (activityId) {
                condition = {...condition, activityId};
            }

            // FETCH ACTIVITY SCHEDULES
            const activitySchedules = await activityScheduleService.fetchActivitySchedules({
                size: Number(size),
                page: Number(page),
                condition,
            });

            // RETURN RESPONSE
            return res.status(200).json({
                message: "Activity schedules fetched successfully!",
                data: activitySchedules,
            });
        } catch (error) {
            next(error);
        }
    },

    // GET ACTIVITY SCHEDULE BY ID
    async getActivityScheduleById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            // FETCH ACTIVITY SCHEDULE
            const activitySchedule = await activityScheduleService.getActivityScheduleDetails(id as UUID);

            // RETURN RESPONSE
            return res.status(200).json({
                message: "Activity schedule fetched successfully!",
                data: activitySchedule,
            });
        } catch (error) {
            next(error);
        }
    },

    // DELETE ACTIVITY SCHEDULE
    async deleteActivitySchedule(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            // DELETE ACTIVITY SCHEDULE
            await activityScheduleService.deleteActivitySchedule(id as UUID);

            // RETURN RESPONSE
            return res.status(204).json({
                message: "Activity schedule deleted successfully!",
            });
        } catch (error) {
            next(error);
        }
    },

    // UPDATE ACTIVITY SCHEDULE
    async updateActivitySchedule(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { startTime, endTime, description, disclaimer, activityId, numberOfSeats } = req.body;

            // UPDATE ACTIVITY SCHEDULE
            const updatedActivitySchedule = await activityScheduleService.updateActivitySchedule(id as UUID, {
                startTime,
                endTime,
                description,
                disclaimer,
                activityId,
                numberOfSeats,
            });

            // RETURN RESPONSE
            return res.status(200).json({
                message: "Activity schedule updated successfully!",
                data: updatedActivitySchedule,
            });
        } catch (error) {
            next(error);
        }
    },
};

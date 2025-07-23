import { FastifyInstance } from 'fastify';
import { AddUserRequestBody, GetUserParams, SetActivityParams, SetActivityRequestBody } from '../controllers/types';
import { addUser, getUser, setActivity } from '../controllers/user.controller';
import { addUserSchema, getUserSchema, setActivitySchema } from '../schemas';

export const userRoutes = (app: FastifyInstance) => {
    app.post<{ Body: AddUserRequestBody }>('/add', { preHandler: [app.adminAuthenticate], schema: addUserSchema }, addUser);
    app.post<{ Body: SetActivityRequestBody, Params: SetActivityParams }>('/setActivity/:isActive', { preHandler: [app.adminAuthenticate], schema: setActivitySchema }, setActivity)
    app.get<{ Params: GetUserParams }>('/get/:userId', { preHandler: [app.adminAuthenticate], schema: getUserSchema }, getUser);
}
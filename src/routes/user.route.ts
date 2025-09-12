import { FastifyInstance } from 'fastify';
import { AddUserRequestBody, BlockUserRequestBody, GetUserParams, SetActivityParams, SetActivityRequestBody } from '../controllers/types';
import { addUser, blockUser, getUser, setActivity } from '../controllers/user.controller';
import { addUserSchema, blockUserSchema, getUserSchema, setActivitySchema } from '../schemas';

export const userRoutes = (app: FastifyInstance) => {
    app.post<{ Body: AddUserRequestBody }>('/add', { preHandler: [app.adminAuthenticate], schema: addUserSchema }, addUser);
    app.post<{ Body: BlockUserRequestBody }>('/block', { preHandler: [app.adminAuthenticate], schema: blockUserSchema }, blockUser);
    app.post<{ Body: SetActivityRequestBody, Params: SetActivityParams }>('/setActivity/:isActive', { preHandler: [app.adminAuthenticate], schema: setActivitySchema }, setActivity)
    app.get<{ Params: GetUserParams }>('/get/:userId', { preHandler: [app.adminAuthenticate], schema: getUserSchema }, getUser);
};
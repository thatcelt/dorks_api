import { PRISMA, REFRESH_INTERVAIL_MILLIS, USERS_CACHE } from "../constants"

const refreshUsersCache = async () => {
    try {
        const allUsers = await PRISMA.user.findMany({ where: { isActive: true } });

        USERS_CACHE.length = 0;
        USERS_CACHE.push(...allUsers.map(user => user.apiKey));
    } catch (error) {
        console.error(error);
    } finally {
        setTimeout(refreshUsersCache, REFRESH_INTERVAIL_MILLIS);
    }
}

export const onReadyHook = async () => {
    refreshUsersCache();
}
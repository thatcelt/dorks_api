// types/adbkit.d.ts
declare module 'adbkit' {
    export class Adb {
        createClient(): AdbClient;
    };

    export class AdbClient {
        listDevices(): Promise<Array<{ id: string; }>>;
        shell(serial: string, command: string): Promise<any>;
    };
};
import fs from 'fs';

import frida, { Script, ScriptExports, ScriptMessageHandler } from 'frida';
import { FRIDA_SCRIPT_PATH, MAIN_PROCESS } from '../constants';
import adbkit, { Adb } from 'adbkit';

const client = (adbkit as unknown as Adb).createClient();
let fridaApi: ScriptExports;
let script: Script;

const connectADB = async () => {
    try {
        const device = (await client.listDevices())[0].id;
        await client.shell(device, `su -c ${process.env.FRIDA_SERVER_PATH}`);
        console.log(`[+] ADB connected to ${device}.`);
    } catch (error) {
        console.error(`[-] Error connecting to ADB: ${error}`);
    };
};

const loadJavaBridge = () => {
    const bridgeSrc = fs.readFileSync('../scripts/java.js', 'utf-8');
    return `(function() { ${bridgeSrc}; Object.defineProperty(globalThis, 'Java', { value: bridge }); })();\n`;
};

export const loadFrida = async () => {
    await connectADB();
    try {
        const device = await frida.getUsbDevice();
        const session = await device.attach(MAIN_PROCESS);
        script = await session.createScript(loadJavaBridge() + fs.readFileSync(FRIDA_SCRIPT_PATH, 'utf-8'));

        await script.load();
        fridaApi = script.exports;
        console.log('[+] Frida script loaded.');
    } catch (err) {
        console.error('Error:', err);
    };
};

export const hasAlias = async (userId: string) => { return await fridaApi.hasAlias(`auth-keys-${userId}`); };
export const createKeyPair = async (userId: string) => { return await fridaApi.createKeyPair(`auth-keys-${userId}`); };
export const deleteEntry = async (userId: string) => { return await fridaApi.deleteEntry(`auth-keys-${userId}`); };
export const getCertificateChain = async (userId: string) => { return await fridaApi.getCertificateChain(`auth-keys-${userId}`); };
export const signECDSA = async (data: string, userId: string) => { return await fridaApi.signECDSA(data, `auth-keys-${userId}`); };
export const sendPlayIntegrityToken = async () => { await fridaApi.sendPlayIntegrityToken(); };
export const getElapsedRealtime = async () => { return await fridaApi.getElapsedRealtime(); };
export const onMessage = (callback: ScriptMessageHandler) => { script.message.connect(callback); }

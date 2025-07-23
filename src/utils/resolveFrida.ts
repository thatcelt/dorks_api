import fs from 'fs';

import frida, { ScriptExports } from 'frida';
import { FRIDA_SCRIPT_PATH, MAIN_PROCESS } from '../constants';

let fridaApi: ScriptExports;

const loadJavaBridge = () => {
    const bridgeSrc = fs.readFileSync('../scripts/java.js', 'utf-8');
    return `(function() { ${bridgeSrc}; Object.defineProperty(globalThis, "Java", { value: bridge }); })();\n`;
}

export const loadFrida = async () => {
    try {
        const device = await frida.getUsbDevice();
        const session = await device.attach(MAIN_PROCESS);
        const script = await session.createScript(loadJavaBridge() + fs.readFileSync(FRIDA_SCRIPT_PATH, 'utf-8'));

        await script.load();
        fridaApi = script.exports;
        console.log('[+] Frida script loaded.');
    } catch (err) {
        console.error("Error:", err);
    }
}

export const hasAlias = async (userId: string) => { return await fridaApi.hasAlias(`auth-keys-${userId}`); }
export const createKeyPair = async (userId: string) => { return await fridaApi.createKeyPair(`auth-keys-${userId}`); }
export const deleteEntry = async (userId: string) => { return await fridaApi.deleteEntry(`auth-keys-${userId}`); }
export const getCertificateChain = async (userId: string) => { return await fridaApi.getCertificateChain(`auth-keys-${userId}`); }
export const signECDSA = async (data: Uint8Array, userId: string) => { return await fridaApi.signECDSA(Array.from(data), `auth-keys-${userId}`); }
export const signHMAC = async (data: Uint8Array) => { return await fridaApi.signHMAC(Array.from(data)); }

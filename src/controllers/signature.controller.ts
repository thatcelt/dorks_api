import { FastifyReply } from "fastify";
import { GenerateECDSARequest, GenerateHMACRequest } from "./types";
import { signECDSA, signHMAC } from "../utils/resolveFrida";
import { ENCODER } from "../constants";


export async function generateHMAC(req: GenerateHMACRequest, reply: FastifyReply) {
    try {
        const generatedHMAC = await signHMAC(ENCODER.encode(req.body.payload));

        return reply.status(200).send({ message: "OK", hmac: generatedHMAC });
    } catch (error) {
        console.error(error);
        return reply.status(400).send({ message: "BAD_REQUEST", details: error });
    }
}

export async function generateECDSA(req: GenerateECDSARequest, reply: FastifyReply) {
    try {
        const generatedECDSA = await signECDSA(ENCODER.encode(req.body.payload), req.body.userId);

        return reply.status(200).send({ message: "OK", ECDSA: generatedECDSA });
    } catch (error) {
        console.error(error);
        return reply.status(400).send({ message: "BAD_REQUEST", details: error });
    }
}
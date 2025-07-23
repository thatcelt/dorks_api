import { randomBytes, createHash } from 'crypto'

export const ecnryptUniqueHash = (userId: string) => {
    const hash = createHash('md5')
    hash.update(userId + randomBytes(16).toString())

    return hash.digest('hex')
}
import { registerMethod, DIDDocument, ParsedDID, PublicKey } from 'did-resolver'
import UportLite from 'uport-lite'

export declare interface LegacyUport {
  publicKey: string
  publicEncKey?: string
  name?: string
  description?: string
  image?: any
}

export function convertToDid (did: string, legacy: LegacyUport) {
  const publicKey: PublicKey[] = [{
    id: `${did}#keys-1`,
    type: 'Secp256k1VerificationKey2018',
    owner: did,
    publicKeyHex: legacy.publicKey.match(/^0x/) ? legacy.publicKey.slice(2) : legacy.publicKey
  }]

  if (legacy.publicEncKey) {
    publicKey.push({
      id: `${did}#keys-2`,
      type: 'Curve25519EncryptionPublicKey',
      owner: did,
      publicKeyBase64: legacy.publicEncKey
    })
  }

  const doc: DIDDocument = {
    '@context': 'https://w3id.org/did/v1',
    id: did,
    publicKey,
    authentication: [{
      type: 'Secp256k1SignatureAuthentication2018',
      publicKey: `${did}#keys-1`
    }]
  }

  if (legacy.name || legacy.description || legacy.image) {
    const profile = Object.assign({}, legacy)
    delete profile['publicKey']
    delete profile['publicEncKey']
    doc.uportProfile = profile
  }
  return doc
}

export default function register (configured?: UportLiteRegistry) {
  const cpsRegistry: UportLiteRegistry = configured || UportLite()

  const registry = (mnid: string) : Promise<LegacyUport | DIDDocument | null> => new Promise((resolve, reject) => {
    cpsRegistry(mnid, (error?: any, doc?: any) => error ? reject(error) : resolve(doc))
  })

  async function resolve (did: string, parsed: ParsedDID) : Promise<DIDDocument | null> {
    const doc = await registry(parsed.id)
    if (!doc) return null
    // Check if real DID document or legacy
    if ((<DIDDocument>doc)['@context'] === 'https://w3id.org/did/v1') return <DIDDocument>doc
    if (typeof doc['publicKey'] === 'string') {
      return convertToDid(did, <LegacyUport>doc)
    }
    return null
  }

  registerMethod('uport', resolve)
}

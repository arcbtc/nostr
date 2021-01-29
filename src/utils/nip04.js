import crypto from 'crypto'
import * as secp from 'noble-secp256k1'

export function encrypt(privkey, pubkey, text) {
  const key = secp.getSharedSecret(privkey, '02' + pubkey)

  let iv = crypto.randomFillSync(new Uint8Array(16))
  var cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  cipher.update(text, 'utf8')
  let encryptedMessage = cipher.final('base64')

  return [encryptedMessage, Buffer.from(iv.buffer).toString('base64')]
}

export function decrypt(privkey, pubkey, ciphertext, iv) {
  const key = secp.getSharedSecret(privkey, '02' + pubkey)

  var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  decipher.update(ciphertext, 'base64')
  let decryptedMessage = decipher.final('utf8')

  return decryptedMessage
}

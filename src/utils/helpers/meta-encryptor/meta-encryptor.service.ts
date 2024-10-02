import { Injectable } from '@nestjs/common';
import {
  Encoding,
  createCipheriv,
  createDecipheriv,
  scryptSync,
  createSign,
  createVerify,
} from 'crypto';

@Injectable()
export class MetaEncryptorService {
  ENC_KEY = process.env.ENC_KEY;
  ENC_IV = process.env.ENC_IV;
  ENC_SALT = process.env.ENC_SALT;
  PRIVATE_KEY = process.env.PRIVATE_KEY;
  PUBLIC_KEY = process.env.PUBLIC_KEY;

  encrypt(
    text: string,
    key: string = this.ENC_KEY,
    encoding: Encoding = 'hex',
  ) {
    const generatedKey = scryptSync(key, this.ENC_SALT, 24);
    const ivCipher = createCipheriv(
      'aes-192-cbc',
      generatedKey,
      Buffer.from(this.ENC_IV, 'hex'),
    );
    let encData = ivCipher.update(text, 'utf-8', encoding);

    return (encData += ivCipher.final(encoding));
  }

  decrypt(
    encText: string,
    key: string = this.ENC_KEY,
    encoding: Encoding = 'utf-8',
  ) {
    const generatedKey = scryptSync(key, this.ENC_SALT, 24);

    const decipherIv = createDecipheriv(
      'aes-192-cbc',
      generatedKey,
      Buffer.from(this.ENC_IV, 'hex'),
    );
    // decipherIv.setAuthTag(Buffer.from(tag, 'hex'));
    let decData = decipherIv.update(encText, 'hex', encoding);
    return (decData += decipherIv.final(encoding));
  }

  sign(input) {
    const signer = createSign('SHA256');
    signer.update(input);
    signer.end();
    return signer.sign(this.PRIVATE_KEY, 'base64');
  }

  verify(input, signature): boolean {
    const verifier = createVerify('SHA256');
    verifier.update(input);
    verifier.end();

    const isValid = verifier.verify(this.PUBLIC_KEY, signature, 'base64');
    return isValid;
  }
}

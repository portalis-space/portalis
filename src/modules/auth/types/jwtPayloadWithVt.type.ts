import { JwtPayload } from '.';

export type JwtPayloadWithVt = JwtPayload & { token: string };

import { ChainsEnum } from '@utils/enums/chains.enum';
import { EvmChain } from 'nftscan-api';

export const chains = { ...EvmChain, ...ChainsEnum };
export type chains = typeof chains;

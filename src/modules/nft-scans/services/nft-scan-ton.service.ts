import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { METHODS } from 'http';
import { catchError, firstValueFrom, lastValueFrom, map } from 'rxjs';
import {
  INftScanPaginateResponse,
  INftScanTonCollectionNft,
  INftScanTonNft,
} from '../interfaces/nft-scans.interface';
import { circularToJSON } from '@utils/helpers';

@Injectable()
export class NftScanTonService {
  private logger = new Logger(NftScanTonService.name);
  private TON_BASE_URL = this.config.get<string>('TON_BASE_URL');
  private NFTSCAN_KEY = this.config.get<string>('NFTSCAN_KEY');
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async getCollection(contractAddress: string) {
    const url = this.TON_BASE_URL + `/ton/collections/${contractAddress}`;

    const config: AxiosRequestConfig = {
      url,
      headers: {
        'X-API-KEY': this.NFTSCAN_KEY,
      },
      method: 'GET',
    };
    try {
      const { data } = await lastValueFrom(this.http.request(config));
      if (!data || data.code !== 200) return null;
      return data.data;
      // if (collection?.data?.code != 200) return null;
      // return collection.data;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async getAllPaginatedNfts(
    walletAddress: string,
    from?: number,
    to?: number,
    contractAddress?: string[],
  ) {
    const url = this.TON_BASE_URL + `/ton/account/own/all/${walletAddress}`;
    const config: AxiosRequestConfig = {
      url,
      headers: {
        'X-API-KEY': this.NFTSCAN_KEY,
      },
      method: 'GET',
    };
    try {
      const { data } = await lastValueFrom(this.http.request(config));
      let nfts = data.data as INftScanTonCollectionNft[];
      if (contractAddress && contractAddress.length > 0) {
        nfts = nfts.filter(nft =>
          contractAddress.includes(nft.contract_address),
        );
      }
      const pagedNft = from && to && nfts.slice(from - 1, to);

      return { count: nfts.length, rows: circularToJSON(pagedNft || nfts) };
    } catch (error) {
      this.logger.error(error);
      return { count: 0, rows: [] };
    }
  }

  async getNftByContract(
    contractAddress: string,
    limit?: number,
    cursor?: string,
  ) {
    const url = this.TON_BASE_URL + `/ton/assets/contract/${contractAddress}`;
    const config: AxiosRequestConfig = {
      url,
      headers: {
        'X-API-KEY': this.NFTSCAN_KEY,
      },
      params: {
        ...(cursor && { cursor }),
        ...(limit && { limit }),
      },
      method: 'GET',
    };
    try {
      const { data } = await lastValueFrom(this.http.request(config));
      return data.data as INftScanPaginateResponse;
    } catch (error) {
      this.logger.error(error);
      const response: INftScanPaginateResponse = {
        content: [],
        next: null,
        total: 0,
      };
    }
  }

  async getSingleNft(token: string) {
    const url = this.TON_BASE_URL + `/ton/assets/${token}`;
    const config: AxiosRequestConfig = {
      url,
      headers: {
        'X-API-KEY': this.NFTSCAN_KEY,
      },
      method: 'GET',
    };
    try {
      const { data } = await lastValueFrom(this.http.request(config));
      return data.data as INftScanTonNft;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
}

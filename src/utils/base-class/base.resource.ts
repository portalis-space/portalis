import * as JsonAPISerializer from 'json-api-serializer';

export const resourceNames = [
  'event',
  'ticket',
  'scanner',
  'scanner-signin',
  'scanner-password',
  'scanner-signup',
  'blockchains',
  'nft',
  'nft-contracts',
  'event-poa',
  'qr-ticket',
  'event-nft-contract',
  'event-schedule',
  'attendees',
  'nft-collection',
  'auth',
  'wallet',
  'schedule',
  'chain',
  'collection',
  'collection-nft',
  'uploader',
] as const;

export type Resource = (typeof resourceNames)[number];

export class BaseResource {
  protected serializer = new JsonAPISerializer();

  /**
   * resource string name
   * @param resourceName
   * @param data
   */
  constructor() {
    /**
     * @see {resource}
     * register all defined resource
     * */
    resourceNames.forEach((market: Resource) => {
      this.serializer.register(market, {
        id: 'id',
      });
    });
  }

  serialize(resourceName: Resource, data: any) {
    // console.log("FROM Base Resource",data)
    // console.log("FROM Base Resource", resourceName)
    return this.serializer.serialize(resourceName, data);
  }
}

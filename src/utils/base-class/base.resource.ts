import * as JsonAPISerializer from 'json-api-serializer';

export const resourceNames = [
  'event',
  'ticket',
  'scanner',
  'nft',
  'qr-ticket',
  'auth',
  'wallet',
  'schedule',
  'chain',
  'collection',
  'collection-nft',
  'uploader',
  'participant',
  'quest',
  'progress',
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

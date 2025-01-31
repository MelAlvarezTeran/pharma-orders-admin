/* eslint-disable prettier/prettier */

import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class MasterDataClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.account}.vtexcommercestable.com.br/api/dataentities`,
      context,
      {
        ...options,
        headers: {
          VtexIdClientAutCookie:
            context.adminUserAuthToken ??
            context.storeUserAuthToken ??
            context.authToken,
          'REST-Range': 'resources=0-100',
        },
      }
    )
  }

  public async getData() {
    return this.http.getRaw(
      `/pharmaOrders/search?_fields=_all&_sort=createdIn DESC`
    )
  }

  public async saveData(body: SaveDataInMasterDataBody) {
    return this.http.postRaw(
      `/pharmaOrders/documents?_schema=pharma-orders`,
      body
    )
  }

  public async getIdOfOrder(orderId: string) {
    return this.http.getRaw(
      `/pharmaOrders/search?_schema=pharma-orders&_fields=id,orderId,status&_where=orderId=${orderId}`
    )
  }

  public async updateDocument(id: string, body: SaveDataInMasterDataBody) {
    await this.http.patch(
      `/pharmaOrders/documents/${id}?_schema=pharma-orders`,
      body
    )

    return { status: 200 }
  }
}

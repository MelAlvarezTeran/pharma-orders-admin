import React from 'react'
import { EXPERIMENTAL_Table as Table, Button } from 'vtex.styleguide'
import useTableMeasures from '@vtex/styleguide/lib/EXPERIMENTAL_Table/hooks/useTableMeasures'
import { useQuery } from 'react-apollo'
import { useIntl } from 'react-intl'

import getOrderItems from '../graphql/getOrderItems.gql'
import LoadingSpinner from './LoadingSpinner'
import { titlesIntl } from '../utils/intl'

export default function ProductsTable({ orderId }: ProductTableProps) {
  const intl = useIntl()

  const responseFromGetOrder = useQuery(getOrderItems, {
    variables: { orderId },
    ssr: false,
  })

  const items = responseFromGetOrder?.data?.getOrder?.data?.items

  const columns = [
    {
      id: 'productId',
      title: intl.formatMessage(titlesIntl.productTableProductId),
    },
    {
      id: 'quantity',
      title: intl.formatMessage(titlesIntl.productTableQuantity),
    },
    {
      id: 'name',
      title: intl.formatMessage(titlesIntl.productTableName),
    },
  ]

  const measures = useTableMeasures({ size: items?.length })

  const goToCheckout = (products: any) => {
    const queryString = products.map((product: any) => {
      return `sku=${product.id}&qty=${product.quantity}&seller=1&sc=1`
    })

    const queryStringJoin = queryString.join('&')

    window.open(`/checkout/cart/add/?${queryStringJoin}`, '_blank')
  }

  return (
    <div className="mt7">
      <h1>Productos que se agregarán al carrito</h1>
      {!items && <LoadingSpinner />}
      {items && (
        <Table
          measures={measures}
          items={items}
          columns={columns}
          highlightOnHover
        />
      )}
      <Button
        variation="secondary"
        size="small"
        onClick={() => goToCheckout(items)}
      >
        Continuar al Checkout
      </Button>
    </div>
  )
}

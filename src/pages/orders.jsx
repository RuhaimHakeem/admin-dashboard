import { Helmet } from 'react-helmet-async';

import { OrdersView } from 'src/sections/order';

export default function Orders() {
  return (
    <>
      <Helmet>
        <title> Orders</title>
      </Helmet>

      <OrdersView />
    </>
  );
}

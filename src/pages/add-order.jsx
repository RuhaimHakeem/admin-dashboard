import { Helmet } from 'react-helmet-async';

import { AddOrderView } from 'src/sections/order';

export default function AddOrder() {
  return (
    <>
      <Helmet>
        <title> Add Order </title>
      </Helmet>

      <AddOrderView />
    </>
  );
}

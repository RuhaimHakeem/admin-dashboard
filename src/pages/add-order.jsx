import { Helmet } from 'react-helmet-async';

import { AddOrderView } from 'src/sections/order';

export default function AddOrder() {
  return (
    <>
      <Helmet>
        <title> Order | Minimal UI </title>
      </Helmet>

      <AddOrderView />
    </>
  );
}

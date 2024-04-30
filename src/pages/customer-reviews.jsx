import { Helmet } from 'react-helmet-async';

import CustomerReviewsView from 'src/sections/customer-review/customer-reviews-view';

export default function CustomerReviews() {
  return (
    <>
      <Helmet>
        <title> Customer Reviews </title>
      </Helmet>

      <CustomerReviewsView />
    </>
  );
}

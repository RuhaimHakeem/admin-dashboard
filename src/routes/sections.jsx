import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import CustomerReviews from 'src/pages/customer-reviews';
import Orders from 'src/pages/orders';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const AddOrder = lazy(() => import('src/pages/add-order'));

// ----------------------------------------------------------------------

export default function Router() {
  const user = true;

  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: user
        ? [
            { element: <IndexPage />, index: true },
            { path: 'user', element: <UserPage /> },
            { path: 'products', element: <ProductsPage /> },
            { path: 'blog', element: <BlogPage /> },
            { path: 'add-order', element: <AddOrder /> },
            { path: 'customer-reviews', element: <CustomerReviews /> },
            { path: 'orders', element: <Orders /> },
          ]
        : undefined,
    },
    {
      path: '/',
      element: !user.isLoggedIn ? <LoginPage /> : undefined,
    },
    // {
    //   path: '404',
    //   element: <Page404 />,
    // },
    // {
    //   path: '*',
    //   element: <Navigate to="/404" replace />,
    // },
  ]);

  return routes;
}

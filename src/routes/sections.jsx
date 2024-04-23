import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Orders from 'src/pages/orders';
import DashboardLayout from 'src/layouts/dashboard';
import CustomerReviews from 'src/pages/customer-reviews';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const AddOrder = lazy(() => import('src/pages/add-order'));

export default function Router() {
  const userJSON = localStorage.getItem('user');
  const user = JSON.parse(userJSON);

  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: user?.isLoggedIn
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
      element: !user?.isLoggedIn ? <LoginPage /> : undefined,
      index: true,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}

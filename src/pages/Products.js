import { useFormik } from 'formik';
import { useState, useMemo, useEffect } from 'react';
// material
import { Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
//
import PRODUCTS from '../_mocks_/products';

import { ProductContext } from '../context/ProductContext';
import Searchbar from '../layouts/dashboard/Searchbar';
import axiosHelper from '../utils/axios';

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  const [openFilter, setOpenFilter] = useState(false);

  const formik = useFormik({
    initialValues: {
      gender: '',
      category: '',
      colors: '',
      priceRange: '',
      rating: '',
    },
    onSubmit: () => {
      setOpenFilter(false);
    },
  });

  const { resetForm, handleSubmit } = formik;

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    handleSubmit();
    resetForm();
  };

  const [cart, setCart] = useState(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')).length : 0);
  const providerValue = useMemo(() => ({ cart, setCart }), [cart, setCart]);

  useEffect(() => {
    axiosHelper('get', '/customer/order/menu').then(res => {
      setProducts(res.data.data);
    });
  }, []);

  const [products, setProducts] = useState(null);

  const SORT_BY_OPTIONS = [
    { value: 'priceDesc', label: 'Price: High-Low' },
    { value: 'priceAsc', label: 'Price: Low-High' },
  ];
  const [sortBy, setSortBy] = useState(SORT_BY_OPTIONS[0]);

  console.log(formik.values, sortBy);

  return (
    <Page title="Dashboard: Products | ">
      <Container>
        <ProductContext.Provider value={providerValue}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            <div className="">
              <div>Menu</div>
              <Searchbar />
            </div>
          </Typography>

          <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
            <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
              <ProductFilterSidebar
                formik={formik}
                isOpenFilter={openFilter}
                onResetFilter={handleResetFilter}
                onOpenFilter={handleOpenFilter}
                onCloseFilter={handleCloseFilter}
              />
              <ProductSort sortBy={sortBy} setSortBy={setSortBy} options={SORT_BY_OPTIONS} />
            </Stack>
          </Stack>

          {products && <ProductList products={products} />}
        </ProductContext.Provider>
      </Container>
    </Page>
  );
}

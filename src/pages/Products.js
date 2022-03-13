import { useFormik } from 'formik';
import { useState, useMemo } from 'react';
// material
import { Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
//
import PRODUCTS from '../_mocks_/products';

import { ProductContext } from '../context/ProductContext';
import Searchbar from '../layouts/dashboard/Searchbar';

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
              <ProductSort />
            </Stack>
          </Stack>

          <ProductList products={PRODUCTS} />
        </ProductContext.Provider>
      </Container>
    </Page>
  );
}

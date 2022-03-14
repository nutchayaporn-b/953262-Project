import { useFormik } from 'formik';
import { useState, useMemo, useEffect } from 'react';
// material
import { Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';

import { ProductContext } from '../context/ProductContext';
import Searchbar from '../layouts/dashboard/Searchbar';
import axiosHelper from '../utils/axios';

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  const [openFilter, setOpenFilter] = useState(false);

  const formik = useFormik({
    initialValues: {
      category: '',
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

  const [cart, setCart] = useState(0);
  const providerValue = useMemo(() => ({ cart, setCart }), [cart, setCart]);

  useEffect(async () => {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const productAmount = cart.reduce((acc, cur) => acc + (cur.amount || 1), 0);
    setCart(productAmount);
    await axiosHelper('get', '/customer/order/menu').then(res => {
      setProducts(res.data.data);
    });
  }, []);
  const [products, setProducts] = useState(null);
  const [filter, setFilter] = useState(products);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setFilter(products);
  }, [products]);

  useEffect(() => {
    const { category, priceRange, rating } = formik.values;
    if (!category && !priceRange && !search) return setFilter(products);
    let filterProducts = [];

    if (priceRange) {
      if (priceRange.includes('-')) {
        filterProducts = products.filter(product => product.price < parseFloat(priceRange.replace('-', '')));
      } else if (priceRange.includes('+')) {
        filterProducts = products.filter(product => product.price > parseFloat(priceRange.replace('+', '')));
      } else {
        filterProducts = products.filter(
          product =>
            product.price >= parseFloat(priceRange.split(',')[0]) &&
            product.price <= parseFloat(priceRange.split(',')[1]),
        );
      }
    }

    if (category !== '' && category !== []) {
      if (priceRange) {
        if (category.length > 1) {
          const temp = [];
          category.forEach(cat => {
            temp.push(filterProducts.filter(product => product.category.name === cat));
          });
          filterProducts = temp.flat();
        } else {
          category.forEach(category => {
            filterProducts = filterProducts.filter(product => product.category.name === category);
          });
        }
      } else {
        category.forEach(category => {
          const temp = products.filter(product => product.category.name === category);
          filterProducts = [...filterProducts, ...temp];
        });
      }
    }

    if (search !== '') {
      if (priceRange || category || category.length !== 0) {
        filterProducts = filterProducts.filter(product => product.name.toLowerCase().includes(search.toLowerCase()));
      } else filterProducts = products.filter(product => product.name.toLowerCase().includes(search.toLowerCase()));
    }

    let result = [];
    filterProducts.forEach(product => {
      result = result.concat(product);
    });
    setFilter(result);
  }, [formik.values, search]);

  return (
    <Page title="Dashboard: Products | ">
      <Container>
        <ProductContext.Provider value={providerValue}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            <div className="">
              <div>Menu</div>
              <Searchbar search={search} setSearch={setSearch} />
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
            </Stack>
          </Stack>

          {products && <ProductList products={filter || products} />}
        </ProductContext.Provider>
      </Container>
    </Page>
  );
}

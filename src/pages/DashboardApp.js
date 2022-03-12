// material
import { Box, Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';

import OrderProductCard from '../sections/@dashboard/products/OrderProductCard';
import PRODUCTS from '../_mocks_/products';

// ----------------------------------------------------------------------
function ProductList({ products, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {products.map(product => (
        <Grid key={product.id} item xs={12} sm={6} md={3}>
          <OrderProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}

export default function DashboardApp() {
  return (
    <Page title="Dashboard | ">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }} className="text-[#1a910a]">
          <Typography variant="h4">Your orders will appear here</Typography>
        </Box>
        <ProductList products={PRODUCTS} />
      </Container>
    </Page>
  );
}

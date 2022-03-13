import { Fragment, useRef, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationIcon } from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider } from 'formik';
// material
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Rating,
  Divider,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
//
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import ColorManyPicker from '../../../components/ColorManyPicker';
import { ProductContext } from '../../../context/ProductContext';
import Searchbar from '../../../layouts/dashboard/Searchbar';
import axiosHelper from '../../../utils/axios';

export const FILTER_GENDER_OPTIONS = ['Men', 'Women', 'Kids'];
export const FILTER_CATEGORY_OPTIONS = ['All', 'Shose', 'Apparel', 'Accessories'];
export const FILTER_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];
export const FILTER_PRICE_OPTIONS = [
  { value: 'below10', label: 'Below $10' },
  { value: 'between10-20', label: 'Between $10 - $20' },
  { value: 'above20', label: 'Above $20' },
];
export const FILTER_COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

ShopFilterSidebar.propTypes = {
  isOpenFilter: PropTypes.bool,
  onResetFilter: PropTypes.func,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  formik: PropTypes.object,
};

export default function ShopFilterSidebar({ isOpenFilter, onResetFilter, onOpenFilter, onCloseFilter, formik }) {
  useEffect(() => {
    axiosHelper('get', '/customer/order/category').then(res => {
      setCategories(res.data.data);
    });
  });

  const [categories, setCategories] = useState(null);

  const { values, getFieldProps, handleChange } = formik;
  const { cart } = useContext(ProductContext);
  const navigate = useNavigate();

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={() => {
          navigate('/dashboard');
        }}
      >
        Order List &nbsp; <div className="bg-green-500 text-white rounded-[50%] px-3 py-1">{cart}</div>
      </Button>

      <Button disableRipple color="inherit" endIcon={<Iconify icon="ic:round-filter-list" />} onClick={onOpenFilter}>
        Filters&nbsp;
      </Button>

      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <Drawer
            anchor="right"
            open={isOpenFilter}
            onClose={onCloseFilter}
            PaperProps={{
              sx: { width: 280, border: 'none', overflow: 'hidden' },
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                Filters
              </Typography>
              <IconButton onClick={onCloseFilter}>
                <Iconify icon="eva:close-fill" width={20} height={20} />
              </IconButton>
            </Stack>

            <Divider />

            <Scrollbar>
              <Stack spacing={3} sx={{ p: 3 }}>
                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Category
                  </Typography>
                  <FormGroup>
                    {categories.map(item => (
                      <FormControlLabel
                        key={item}
                        control={
                          <Checkbox {...getFieldProps('gender')} value={item} checked={values.gender.includes(item)} />
                        }
                        label={item}
                      />
                    ))}
                  </FormGroup>
                </div>

                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Price
                  </Typography>
                  <RadioGroup {...getFieldProps('priceRange')}>
                    {FILTER_PRICE_OPTIONS.map(item => (
                      <FormControlLabel key={item.value} value={item.value} control={<Radio />} label={item.label} />
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Rating
                  </Typography>
                  <RadioGroup {...getFieldProps('rating')}>
                    {FILTER_RATING_OPTIONS.map((item, index) => (
                      <FormControlLabel
                        key={item}
                        value={item}
                        control={
                          <Radio
                            disableRipple
                            color="default"
                            icon={<Rating readOnly value={4 - index} />}
                            checkedIcon={<Rating readOnly value={4 - index} />}
                          />
                        }
                        label="& Up"
                        sx={{
                          my: 0.5,
                          borderRadius: 1,
                          '& > :first-of-type': { py: 0.5 },
                          '&:hover': {
                            opacity: 0.48,
                            '& > *': { bgcolor: 'transparent' },
                          },
                          ...(values.rating.includes(item) && {
                            bgcolor: 'background.neutral',
                          }),
                        }}
                      />
                    ))}
                  </RadioGroup>
                </div>
              </Stack>
            </Scrollbar>

            <Box sx={{ p: 3 }}>
              <Button
                fullWidth
                size="large"
                type="submit"
                color="inherit"
                variant="outlined"
                onClick={onResetFilter}
                startIcon={<Iconify icon="ic:round-clear-all" />}
              >
                Clear All
              </Button>
            </Box>
          </Drawer>
        </Form>
      </FormikProvider>
    </>
  );
}

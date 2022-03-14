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
import OrderProductCard from './OrderProductCard';

export const FILTER_GENDER_OPTIONS = ['Men', 'Women', 'Kids'];
export const FILTER_CATEGORY_OPTIONS = ['All', 'Shose', 'Apparel', 'Accessories'];
export const FILTER_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];
export const FILTER_PRICE_OPTIONS = [
  { value: '-5', label: 'Below $5' },
  { value: '5,14', label: 'From $5-14' },
  { value: '+14', label: 'Above $14' },
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
  }, []);

  const [categories, setCategories] = useState(null);

  const { values, getFieldProps, handleChange } = formik;
  const { cart } = useContext(ProductContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <OrderListPopUp isOpen={isOpen} setIsOpen={setIsOpen} />
      <Button
        disableRipple
        color="inherit"
        onClick={() => {
          setIsOpen(true);
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
                    {categories?.map(item => (
                      <FormControlLabel
                        key={item.name}
                        control={
                          <Checkbox
                            {...getFieldProps('category')}
                            value={item.name}
                            checked={values.category.includes(item.name)}
                          />
                        }
                        label={item.name}
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

function OrderListPopUp({ isOpen, setIsOpen }) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setIsOpen}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <OrderProductCard />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

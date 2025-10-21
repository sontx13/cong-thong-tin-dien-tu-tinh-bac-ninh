import { atom, selector, selectorFamily } from "recoil";
import {
  getAccessToken,
  getLocation,
  getPhoneNumber,
  getUserInfo,
} from "zmp-sdk";
import {
  BASE_URL,
  endpoint,
  saveUserZmp,
  secretKey,
  getcategories,
  getbycategory,
} from "./configs";
import {
  Booking,
  Cart,
  Location,
  Restaurant,
  TabType,
  Article,
  PageInfor,
} from "./models";
import { calcCrowFliesDistance } from "./utils/location";
import categories from "../mock/categories.json";
import { CategoryType } from "./types/category_type";


export const userState = selector({
  key: "user",
  get: async () => {
    try {
      const { userInfo } = await getUserInfo({});
      return userInfo;
    } catch (error) {
      return {
        avatar: "",
        name: "",
        id: "",
      };
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  },
});

export const listConfig = selectorFamily({
  key: "configs",
  get: (name: string) => async () => {
    const res = await fetch(`${BASE_URL}/zalo/configZalo`);
    const jsonData = await res.json();
    //console.log(jsonData);
    const data = jsonData.data;
    return data;
  },
});

export const configValue = selectorFamily({
  key: "configValue",
  get: (name: string) => async () => {
    const res = await fetch(`${BASE_URL}/zalo/configZalo?name=${name}`);
    const jsonData = await res.json();
    const data = jsonData.data;
    const data_name = data.find((config) => config.name_config === name);
    const value = data_name ? data_name.value_config : "";
    //console.log(value);
    return value;
  },
});

export const checkUser = selectorFamily({
  key: "checkUser",
  get: (zid: string) => async () => {
    const res = await fetch(`${BASE_URL}/user_zmp/getUserZmp?zid=${zid}`);
    const jsonData = await res.json();
    const data = jsonData.data;
    let check = {
      check: 0,
      id_xa: 0,
    };
    if (data == null) {
      check = {
        check: 0,
        id_xa: 0,
      };
    } else {
      if (data.donvi != null) {
        check = {
          check: 1,
          id_xa: data.donvi.ID_XA,
        };
      } else {
        check = {
          check: 0,
          id_xa: 0,
        };
      }
    }
    return check;
  },
});

export const listCongKhai = selectorFamily({
  key: "ttCongKhai",
  get: (id: any) => async () => {
    const res = await fetch(`${BASE_URL}/zalo/ttCongKhaiByXa?id=${id}`);
    const jsonData = await res.json();
    const data = jsonData.data;
    return data;
  },
});

export const requestPhoneTriesState = atom({
  key: "requestPhoneTries",
  default: 0,
});

export const phoneState = selector<string | boolean>({
  key: "phone",
  get: async ({ get }) => {
    const requested = get(requestPhoneTriesState);
    if (requested) {
      const { number, token } = await getPhoneNumber({ fail: console.warn });
      if (number) {
        return number;
      }
      const access_token = await getAccessToken();
      //console.warn("Sử dụng token này để truy xuất số điện thoại của người dùng",token,);
      //console.warn("access_token===", access_token);

      const response = await fetch(`${endpoint}`, {
        method: "GET",
        headers: {
          access_token: access_token,
          code: JSON.stringify(token),
          secret_key: `${secretKey}`,
        },
      });
      const data = await response.json();
      console.log(data);

      const { userInfo } = await getUserInfo({});

      const postUserZmp = await fetch(`${BASE_URL}/${saveUserZmp}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ZID: userInfo.id,
          NAME: userInfo.name,
          AVATAR: userInfo.avatar,
          PHONE_NUMBER: data?.data?.number,
        }),
      });
      const data_user = await postUserZmp.json();
      console.log(data_user);

      // console.warn(
      //   "Chi tiết tham khảo: ",
      //   "https://mini.zalo.me/blog/thong-bao-thay-doi-luong-truy-xuat-thong-tin-nguoi-dung-tren-zalo-mini-app"
      // );
      //console.warn("Giả lập số điện thoại mặc định: 0337076898");
      return data?.data?.number;
    }
    return false;
  },
});

export const retryLocationState = atom({
  key: "retryLocation",
  default: 0,
});

export const positionState = selector<Location | undefined>({
  key: "position",
  get: async ({ get }) => {
    try {
      const allow = get(retryLocationState);
      if (allow) {
        const { latitude, longitude, token } = await getLocation({});
        if (token) {
          console.warn(
            "Gửi token này lên server để giải mã vị trí. Xem hướng dẫn tại: https://mini.zalo.me/blog/thong-bao-thay-doi-luong-truy-xuat-thong-tin-nguoi-dung-tren-zalo-mini-app",
            token
          );
          return {
            lat: 10.762701,
            long: 106.681974,
          }; // VNG Campus
        }
        return {
          lat: Number(latitude),
          long: Number(longitude),
        };
      }
    } catch (error) {
      return undefined;
    }
    return undefined;
  },
});


export const categories_newState = selector<CategoryType[]>({
  key: "categories",
  get: () => categories,
});

export const selectedCategoryIdState = atom({
  key: "selectedCategoryId",
  default: "coffee",
});

export const restaurantsState = selector<Restaurant[]>({
  key: "restaurants",
  get: () => [
    {
      id: 1,
      name: "Chi nhánh - Lê Thánh Tôn",
      districtId: 1,
      rating: 4.5,
      location: {
        lat: 10.776463610730223,
        long: 106.70098038648123,
      },
      address: "15A Lê Thánh Tôn, Quận 1, Hồ Chí Minh",
      views: 100,
      image:
        "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80",
      hours: {
        opening: [9, 0, "AM"],
        closing: [22, 0, "PM"],
      },
      days: {
        opening: 1,
        closing: 7,
      },
      hotline: "0123 456 789",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.394868527438!2d106.70554879999999!3d10.781038700000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f492daac79b%3A0x16e334e4778de0c1!2zMTVhIEzDqiBUaMOhbmggVMO0biwgQuG6v24gTmdow6ksIFF14bqtbiAxLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1655781904560!5m2!1svi!2s",
    },
    {
      id: 2,
      name: "Chi nhánh - Trần Hưng Đạo",
      address: "15A Trần Hưng Đạo, Đa Kao, Quận 1, Hồ Chí Minh",
      districtId: 1,
      rating: 4.5,
      location: {
        lat: 10.755009040272618,
        long: 106.67897941334107,
      },
      views: 50,
      image:
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
      hours: {
        opening: [9, 0, "AM"],
        closing: [22, 0, "PM"],
      },
      days: {
        opening: 1,
        closing: 7,
      },
      hotline: "0123 456 789",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.585876004013!2d106.69000821538795!3d10.766364992328358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1640b88ca3%3A0x8d9f87825b5b807!2zMTIxLzE1IMSQLiBUcuG6p24gSMawbmcgxJDhuqFvLCBQaMaw4budbmcgUGjhuqFtIE5nxakgTMOjbywgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1655782080310!5m2!1svi!2s",
    },
  ],
});

//export const categoriesState = selector({
  //key: "categories",
  //get: () => ["Pizza", "Pasta", "Salad", "Sandwich", "Drink"],
//});

// export const menuState = selector({
//   key: "menu",
//   get: ({ get }) => {
//     const categories = get(categoriesState);
//     const foods = get(foodsState);
//     return {
//       categories: categories.map((category, index) => ({
//         id: String(index),
//         name: category,
//         foods: foods.filter((food) => food.categories.includes(category)),
//       })),
//     };
//   },
// });

export const foodsState = selector({
  key: "foods",
  get: () => [
    {
      id: 1,
      name: "Daily Pizza",
      price: 400000,
      image:
        "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      categories: ["Pizza", "Pasta", "Salad", "Sandwich", "Drink"],
      description: `Pizza Hải Sản Xốt Pesto Với Hải Sản (Tôm, Mực) Nhân Đôi Cùng Với Nấm Trên Nền Xốt Pesto Đặc Trưng, Phủ Phô Mai Mozzarella Từ New Zealand Và Quế Tây.`,
      options: [
        {
          key: "cheese",
          label: "Thêm phô mai",
          selected: true,
        },
        {
          key: "no-onion",
          label: "Không hành",
          selected: false,
        },
        {
          key: "seafood",
          label: "Thêm hải sản",
          selected: false,
        },
      ],
      extras: [
        {
          key: "size",
          label: "Size (Khẩu phần)",
          options: [
            {
              key: "small",
              label: "Nhỏ",
            },
            {
              key: "medium",
              label: "Vừa",
              selected: true,
            },
            {
              key: "large",
              label: "To",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Prosciutto",
      price: 400000,
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      categories: ["Pizza"],
      description: `Pizza Hải Sản Xốt Pesto Với Hải Sản (Tôm, Mực) Nhân Đôi Cùng Với Nấm Trên Nền Xốt Pesto Đặc Trưng, Phủ Phô Mai Mozzarella Từ New Zealand Và Quế Tây.`,
      options: [
        {
          key: "cheese",
          label: "Thêm phô mai",
          selected: true,
        },
        {
          key: "no-onion",
          label: "Không hành",
          selected: false,
        },
        {
          key: "seafood",
          label: "Thêm hải sản",
          selected: false,
        },
      ],
      extras: [
        {
          key: "size",
          label: "Size (Khẩu phần)",
          options: [
            {
              key: "small",
              label: "Nhỏ",
            },
            {
              key: "medium",
              label: "Vừa",
              selected: true,
            },
            {
              key: "large",
              label: "To",
            },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "Prosciutto",
      price: 400000,
      image:
        "https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1631&q=80",
      categories: ["Pizza", "Drink"],
      description: `Pizza Hải Sản Xốt Pesto Với Hải Sản (Tôm, Mực) Nhân Đôi Cùng Với Nấm Trên Nền Xốt Pesto Đặc Trưng, Phủ Phô Mai Mozzarella Từ New Zealand Và Quế Tây.`,
      options: [
        {
          key: "cheese",
          label: "Thêm phô mai",
          selected: true,
        },
        {
          key: "no-onion",
          label: "Không hành",
          selected: false,
        },
        {
          key: "seafood",
          label: "Thêm hải sản",
          selected: false,
        },
      ],
      extras: [
        {
          key: "size",
          label: "Size (Khẩu phần)",
          options: [
            {
              key: "small",
              label: "Nhỏ",
            },
            {
              key: "medium",
              label: "Vừa",
              selected: true,
            },
            {
              key: "large",
              label: "To",
            },
          ],
        },
      ],
    },
    {
      id: 4,
      name: "Daily Pizza",
      price: 400000,
      image:
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80",
      categories: ["Pizza", "Drink"],
      description: `Pizza Hải Sản Xốt Pesto Với Hải Sản (Tôm, Mực) Nhân Đôi Cùng Với Nấm Trên Nền Xốt Pesto Đặc Trưng, Phủ Phô Mai Mozzarella Từ New Zealand Và Quế Tây.`,
      options: [
        {
          key: "cheese",
          label: "Thêm phô mai",
          selected: true,
        },
        {
          key: "no-onion",
          label: "Không hành",
          selected: false,
        },
        {
          key: "seafood",
          label: "Thêm hải sản",
          selected: false,
        },
      ],
      extras: [
        {
          key: "size",
          label: "Size (Khẩu phần)",
          options: [
            {
              key: "small",
              label: "Nhỏ",
            },
            {
              key: "medium",
              label: "Vừa",
            },
            {
              key: "large",
              label: "To",
            },
          ],
        },
      ],
    },
  ],
});

export const keywordState = atom({
  key: "keyword",
  default: "",
});

export const listCategoryState = selector({
  key: "listCategory",
  get: async ({ get }) => {
    try {
      const response = await fetch(`${BASE_URL}/${getcategories}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "",
      });
      const data = await response.json();
      const listCategory = data.data;
      return listCategory;
    } catch (error) {
      console.log(error);
    }
  },
});

export const pageInfor = atom<PageInfor>({
  key: "pageInfor",
  default: {
    pagenumber: 1,
    pagesize: 300,
    category_id: 1,
  },
});

export const categoryNewsState = selector<Article[]>({
  key: "categoryNews",
  get: async ({ get }) => {
    const activeCategory = get(selectedCategoryState);
    const page = get(pageInfor);
    const dataPost = {
      pagenumber: page.pagenumber,
      pagesize: page.pagesize,
      category_id: activeCategory,
    };
    //console.log(dataPost, 'dataPost state-=-=-=');

    try {
      const response = await fetch(`${BASE_URL}/${getbycategory}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataPost),
      });
      const data = await response.json();
      const categoryNews = data.data;
      return categoryNews;
    } catch (error) {
      console.log(error);
    }
  },
  set: ({ set }, categoryNews) => set(categoryNewsState, categoryNews),
});

export const selectedCategoryState = atom({
  key: "selectedCategory",
  default: 1,
});

export const districtsState = selector({
  key: "districts",
  get: () => [
    {
      id: 1,
      name: "Quận 1",
    },
    {
      id: 5,
      name: "Quận 5",
    },
    {
      id: 7,
      name: "Quận 7",
    },
    {
      id: 13,
      name: "Thủ Đức",
    },
  ],
});

export const selectedDistrictState = atom({
  key: "selectedDistrict",
  default: 1,
});

export const popularRestaurantsState = selector<Restaurant[]>({
  key: "popularRestaurants",
  get({ get }) {
    const restaurants = get(restaurantsState);
    const keyword = get(keywordState);
    const selectedDistrict = get(selectedDistrictState);
    return restaurants
      .filter((restaurant) =>
        restaurant.name.toLowerCase().includes(keyword.toLowerCase())
      )
      .filter(
        (restaurant) =>
          selectedDistrict === 0 || restaurant.districtId === selectedDistrict
      )
      .filter((restaurant) => restaurant.views >= 50);
  },
});

export const nearestRestaurantsState = selector<Restaurant[]>({
  key: "nearestRestaurants",
  get({ get }) {
    const restaurants = get(restaurantsState);
    const position = get(positionState);
    if (position) {
      return [...restaurants].sort((a, b) => {
        const aDistance = calcCrowFliesDistance(position, a.location);
        const bDistance = calcCrowFliesDistance(position, b.location);
        return aDistance - bDistance;
      });
    }
    return restaurants;
  },
});

export const currentRestaurantTabState = atom<TabType>({
  key: "currentRestaurantTab",
  default: "info",
});

export const cartState = atom<Cart>({
  key: "cart",
  default: {
    items: [],
  },
});

export const totalState = selector({
  key: "total",
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.items.reduce(
      (total, item) => total + item.quantity * item.food.price,
      0
    );
  },
});

export const bookingsState = atom<Booking[]>({
  key: "bookings",
  default: [],
  effects: [
    ({ setSelf, getPromise }) => {
      // generate a demo booking item, can be safely deleted if you don't need it
      Promise.all([getPromise(restaurantsState), getPromise(foodsState)]).then(
        ([restaurants, foods]) => {
          setSelf((bookings) => [
            ...(Array.isArray(bookings) ? bookings : []),
            {
              id: "1234567890",
              restaurant: restaurants[0],
              cart: {
                items: [
                  {
                    quantity: 1,
                    food: foods[0],
                    note: "",
                  },
                  {
                    quantity: 2,
                    food: foods[1],
                    note: "Kèm ớt trái",
                  },
                ],
              },
              bookingInfo: {
                date: new Date(),
                hour: [20, 0, "PM"],
                table: "05",
                seats: 4,
              },
            },
          ]);
        }
      );
    },
  ],
});

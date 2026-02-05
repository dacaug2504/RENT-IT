import axios from "axios";
import { getStore } from "../app/storeAccessor";

// ================== ENV VARIABLES ==================
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;
const OWNER_API_URL = import.meta.env.VITE_OWNER_API_URL;
const CART_API_URL = import.meta.env.VITE_CART_API_URL;
const BILL_API_URL =import.meta.env.VITE_BILL_API_URL || "https://localhost:7001";




// if (!AUTH_API_URL || !OWNER_API_URL) {
//   throw new Error("API base URLs not defined. Check .env file");
// }

// ================== AXIOS INSTANCES ==================
const authApi = axios.create({
  baseURL: AUTH_API_URL,
});

const ownerApi = axios.create({
  baseURL: OWNER_API_URL,
});

const productApi = axios.create({
  baseURL: CART_API_URL, // http://localhost:8082
});

export const billApi = axios.create({
  baseURL: BILL_API_URL,
});

// ================== JWT INTERCEPTOR ==================
const attachToken = (config) => {
  const store = getStore();
  const token = store?.getState()?.auth?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

authApi.interceptors.request.use(attachToken);
ownerApi.interceptors.request.use(attachToken);
productApi.interceptors.request.use(attachToken);
billApi.interceptors.request.use(attachToken);



export const authService = {
  login: async (credentials) => {
    return authApi.post("/api/login", credentials);
  },



  register: async (userData) => {
    

    const requestData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      phoneNo: Number(userData.phoneNo),
      address: userData.address,

      // ✅ PURE INTEGERS
      state: Number(userData.state),
      city: Number(userData.city),
      roleId: Number(userData.roleId),

      status: 1
    };

    console.log("FINAL REGISTER PAYLOAD:", requestData);

    return authApi.post("/api/register", requestData);
    },
};


export const userService = {
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      
      // Handle different role structures
      let roleName;
      if (user.role && user.role.role_name) {
        roleName = user.role.role_name;
      } else if (user.role) {
        roleName = user.role;
      } else {
        roleName = 'CUSTOMER';
      }

      return {
        ...user,
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        role: roleName,
        first_name: user.firstName,
        token: localStorage.getItem('token'),

      };
    }
    return null;
  },

  saveUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
  },

  logout: () => {
    localStorage.removeItem('user');
  },
};

export const ownerService = {
  //  FETCH ALL CATEGORIES
  getCategories: async () => {
    return await ownerApi.get('/categories');
  },

  

  //  FETCH ITEMS BY CATEGORY
  getItemsByCategory: async (categoryId) => {
    return await ownerApi.get(`/items/category/${categoryId}`);
  },

  //  ADD ITEM (multipart/form-data)
  addItem: async (itemData, images = {}) => {
    const formData = new FormData();

    //  REQUIRED FIELDS (AS STRING — IMPORTANT)
    formData.append('categoryId', String(itemData.categoryId));
    formData.append('itemId', String(itemData.itemId));
    formData.append('brand', itemData.brand);
    formData.append('description', itemData.description);
    formData.append('conditionType', itemData.conditionType);
    formData.append('rentPerDay', String(itemData.rentPerDay));
    formData.append('depositAmt', String(itemData.depositAmt));
    formData.append('maxRentDays',String(itemData.maxRentDays));

    //  OPTIONAL IMAGES (MultipartFile)
    if (images.img1) formData.append('img1', images.img1);
    if (images.img2) formData.append('img2', images.img2);
    if (images.img3) formData.append('img3', images.img3);
    if (images.img4) formData.append('img4', images.img4);
    if (images.img5) formData.append('img5', images.img5);

    //  DO NOT set Content-Type manually
    return ownerApi.post('/products/add', formData);
  },



  // Get Product Details 
  getProductById: async (otId) => {
    return ownerApi.get(`/products/${otId}`);
  },


  // Edit Product Details
  updateProductDetails: async (otId, data) => {
    return ownerApi.put(`/products/${otId}`, {
      brand: data.brand,
      description: data.description,
      conditionType: data.conditionType,
      rentPerDay: data.rentPerDay,
      depositAmt: data.depositAmt,
      status: data.status,
      maxRentDays: data.maxRentDays
    });
  },

  // ✅ FETCH PRODUCT IMAGES
  getProductImages: async (otId) => {
    return ownerApi.get(`/products/${otId}/images`);
  },

  // ✅ UPDATE PRODUCT IMAGES
  updateProductImages: async (otId, images) => {
    const formData = new FormData();

    Object.entries(images).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    return ownerApi.put(`/products/${otId}/image`, formData);
  },
  
  // MyProducts
  getMyProducts: async () => {
    return ownerApi.get('/products/myProducts');
  },

  //Delete Img
  deleteProductImage: async (otId, imgKey) => {
    return ownerApi.delete(`/products/${otId}/image/${imgKey}`);
  },

  //Delete Product
  deleteProduct: async (otId) => {
  return ownerApi.delete(`/products/${otId}`);
},



};

// ================== ADMIN SERVICE ==================
const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL || "https://localhost:7280";

export const adminServiceAPI = axios.create({
  baseURL: ADMIN_API_URL,
});

// Attach JWT token automatically
adminServiceAPI.interceptors.request.use(attachToken);



// ================== CART SERVICE (ADD-TO-CART) ==================
export const cartService = {
  /**
   * Add item to cart
   * Backend must read userId from JWT (via JwtFilter)
   * Request body: { ownerItemId }
   */
  addToCart: async (ownerItemId) => {
    return productApi.post("/addtocart", { ownerItemId });
  },

  /**
   * Get all cart products for logged-in user
   * Backend must read userId from JWT
   */
  getCartProducts: async () => {
    return productApi.get("/getproductsbyid");
  },

  /**
   * Remove product from cart by cartId
   */
  removeFromCart: async (cartId) => {
    return productApi.delete(`/deleteproductfromcart/${cartId}`);
  },
};

// ================== OWNER ITEM SERVICE ==================
export const ownerItemService = {
  getAllProducts: async () => {
    return productApi.get("/getallproducts"); // http://localhost:8081/getallproducts
  },
   getProductDetails: async (otId) => {
    return productApi.get(`/${otId}/details`);
  }
};

// ================== ORDER SERVICE ==================
export const orderService = {
  /**
   * Place order from single cart item
   */
  placeOrder: async (cartId, startDate, endDate) => {
    return productApi.post(`/order/place?cartId=${cartId}&startDate=${startDate}&endDate=${endDate}`);
  },
  
  /**
   * Place orders for multiple cart items (BULK)
   */
  placeBulkOrders: async (cartIds, startDate, endDate) => {
    return productApi.post('/order/bulk-place', { 
      cartIds, 
      startDate, 
      endDate 
    });
  }
};


// ================== BILLING SERVICE (.NET) ==================
export const billService = {
  /**
   * Get bills for current customer
   * Maps to: GET /api/billing/customer/{customerId}
   * .NET automatically extracts customerId from JWT
   */
  getCustomerBills: async () => {
    try {
      const user = userService.getCurrentUser();
      if (!user || !user.userId) {
        throw new Error("User not logged in");
      }
      
      const response = await billApi.get(`/api/billing/customer/${user.userId}`);
      
      // Transform .NET response to match frontend expectations
      return {
        data: response.data.map(bill => ({
          billNo: bill.billNo,
          customerId: bill.customerId,
          customer: bill.customerName,
          ownerId: bill.ownerId,
          owner: bill.ownerName,
          itemId: bill.itemId,
          item: bill.itemBrand,
          amount: bill.amount,
          billDate: new Date().toISOString(), // .NET doesn't return date yet
        }))
      };
    } catch (error) {
      console.error("Error fetching customer bills:", error);
      throw error;
    }
  },

  /**
   * Get bills for current owner
   * Maps to: GET /api/billing/owner/{ownerId}
   */
  getOwnerBills: async () => {
    try {
      const user = userService.getCurrentUser();
      if (!user || !user.userId) {
        throw new Error("User not logged in");
      }
      
      const response = await billApi.get(`/api/billing/owner/${user.userId}`);
      
      // Transform .NET response
      return {
        data: response.data.map(bill => ({
          billNo: bill.billNo,
          customerId: bill.customerId,
          customer: bill.customerName,
          ownerId: bill.ownerId,
          owner: bill.ownerName,
          itemId: bill.itemId,
          item: bill.itemBrand,
          amount: bill.amount,
          billDate: new Date().toISOString(),
        }))
      };
    } catch (error) {
      console.error("Error fetching owner bills:", error);
      throw error;
    }
  },

  /**
   * Get specific bill details - FIXED TO USE REAL BACKEND DATA
   * Maps to: GET /api/billing/{billNo}
   */
  getBillDetails: async (billNo) => {
    try {
      const response = await billApi.get(`/api/billing/${billNo}`);
      const bill = response.data;
      
      console.log('✅ Raw bill data from C# backend:', bill);
      
      // Use actual data from C# BillResponseDTO (supports both camelCase and PascalCase)
      return {
        data: {
          billNo: bill.billNo || bill.BillNo,
          billDate: bill.billDate || bill.BillDate || new Date().toISOString(),
          
          customer: {
            fullName: bill.customerName || bill.CustomerName,
            email: bill.customerEmail || bill.CustomerEmail,
            phoneNo: bill.customerPhone || bill.CustomerPhone,
            address: bill.customerAddress || bill.CustomerAddress,
            city: bill.customerCity || bill.CustomerCity,
            state: bill.customerState || bill.CustomerState
          },

          owner: {
            fullName: bill.ownerName || bill.OwnerName,
            email: bill.ownerEmail || bill.OwnerEmail,
            phoneNo: bill.ownerPhone || bill.OwnerPhone,
            address: bill.ownerAddress || bill.OwnerAddress,
            city: bill.ownerCity || bill.OwnerCity,
            state: bill.ownerState || bill.OwnerState
          },
          
          item: {
            itemName: bill.itemBrand || bill.ItemBrand,
            brand: bill.itemBrand || bill.ItemBrand,
            description: bill.itemDescription || bill.ItemDescription,
            condition: bill.itemCondition || bill.ItemCondition || "Good",
            rentPerDay: bill.rentPerDay || bill.RentPerDay || 0,
          },
          
          // ✅ FIXED: Use ACTUAL rental data from backend instead of hardcoded values!
          rental: {
            startDate: bill.startDate || bill.StartDate,
            endDate: bill.endDate || bill.EndDate,
            numberOfDays: bill.numberOfDays || bill.NumberOfDays,
            totalRent: bill.totalRent || bill.TotalRent,
            deposit: bill.depositAmount || bill.DepositAmount,
            grandTotal: bill.amount || bill.Amount
          }
        }
      };
    } catch (error) {
      console.error("Error fetching bill details:", error);
      throw error;
    }
  },

  /**
   * Health check endpoint
   */
  testConnection: async () => {
    try {
      const response = await billApi.get("/api/billing/health");
      console.log("✅ .NET Billing Service is healthy:", response.data);
      return response;
    } catch (error) {
      console.error("❌ .NET Billing Service connection failed:", error);
      throw error;
    }
  }
};


export {
  authApi,
  ownerApi,
  productApi,
};
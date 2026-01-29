import axios from "axios";

// ================== ENV VARIABLES ==================
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;
const OWNER_API_URL = import.meta.env.VITE_OWNER_API_URL;

if (!AUTH_API_URL || !OWNER_API_URL) {
  throw new Error("API base URLs not defined. Check .env file");
}

// ================== AXIOS INSTANCES ==================
const authApi = axios.create({
  baseURL: AUTH_API_URL,
});

const ownerApi = axios.create({
  baseURL: OWNER_API_URL,
});

// ================== JWT INTERCEPTOR ==================
const attachToken = (config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

authApi.interceptors.request.use(attachToken);
ownerApi.interceptors.request.use(attachToken);



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
  // ✅ FETCH ALL CATEGORIES
  getCategories: async () => {
    return await ownerApi.get('/categories');
  },

  

  // ✅ FETCH ITEMS BY CATEGORY
  getItemsByCategory: async (categoryId) => {
    return await ownerApi.get(`/items/category/${categoryId}`);
  },

  // ✅ ADD ITEM (multipart/form-data)
  addItem: async (itemData, images = {}) => {
    const formData = new FormData();

    // 🔹 REQUIRED FIELDS (AS STRING — IMPORTANT)
    formData.append('categoryId', String(itemData.categoryId));
    formData.append('itemId', String(itemData.itemId));
    formData.append('brand', itemData.brand);
    formData.append('description', itemData.description);
    formData.append('conditionType', itemData.conditionType);
    formData.append('rentPerDay', String(itemData.rentPerDay));
    formData.append('depositAmt', String(itemData.depositAmt));
    formData.append('maxRentDays',String(itemData.maxRentDays));

    // 🔹 OPTIONAL IMAGES (MultipartFile)
    if (images.img1) formData.append('img1', images.img1);
    if (images.img2) formData.append('img2', images.img2);
    if (images.img3) formData.append('img3', images.img3);
    if (images.img4) formData.append('img4', images.img4);
    if (images.img5) formData.append('img5', images.img5);

    // 🚫 DO NOT set Content-Type manually
    return ownerApi.post('/products/add', formData);
  },



  // ✅ Get Product Details 
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


export { authApi, ownerApi };
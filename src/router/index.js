import Vue from "vue";
import VueRouter from "vue-router";
import Product from "../views/Product.vue";
import Item from "../views/Item.vue";
import Stock from "../views/Stock.vue";
import ProductCreate from "../views/ProductCreate.vue";
import { FormModel } from "ant-design-vue";

Vue.use(VueRouter);
Vue.use(FormModel);

const routes = [
  {
    path: "/product",
    name: "Product",
    component: Product,
  },
  {
    path: "/item",
    name: "Item",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () =>
    //   import(/* webpackChunkName: "about" */ "../views/About.vue")
    component: Item,
  },
  {
    path: "/stock",
    name: "Stock",
    component: Stock,
  },
  {
    path: "/productCreate",
    name: "ProductCreate",
    component: ProductCreate,
  },
];

const router = new VueRouter({
  routes,
});

export default router;

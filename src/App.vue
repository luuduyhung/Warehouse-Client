<template>
  <div id="app">
    <!-- <div id="nav">
       |
      <router-link to="/about">About</router-link>
    </div>-->
    <a-row>
      <a-col :span="4">
        <a-menu mode="inline" theme="dark">
          <a-menu-item key="1">
            <router-link to="/product">Product</router-link>
          </a-menu-item>
          <a-menu-item key="2">
            <router-link to="/item">Item</router-link>
          </a-menu-item>
          <a-menu-item key="3">
            <router-link to="/stock">Stock</router-link>
          </a-menu-item>
        </a-menu>
      </a-col>
      <a-col :span="20">
        <router-view />
      </a-col>
    </a-row>
  </div>
</template>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50; */
  height: 100vh;
  background-color: #ececec;
}
</style>

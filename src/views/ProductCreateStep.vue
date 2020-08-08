<template>
  <div>
    <a-steps :current="current" style="width:50%">
      <a-step title="General" />
      <a-step title="Opening Stock" />
    </a-steps>
    <ProductCreate v-if="current===0" :handleNext="handleNext" />
    <OpeningStock v-else :items="items" :handleBack="handleBack" />
  </div>
</template>

<script>
import ProductCreate from "./ProductCreate";
import OpeningStock from "../components/Product/OpeningStock";

export default {
  components: {
    ProductCreate,
    OpeningStock
  },
  data() {
    return {
      current: 0,
      items: []
    };
  },
  methods: {
    handleNext(items) {
      this.items = items;
      this.current++;
    },
    handleBack() {
      this.current--;
    }
  }
};
</script>

<style>
</style>
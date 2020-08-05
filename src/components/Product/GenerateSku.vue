<template>
  <a-modal title="Generate SKU" :visible="visible" :footer="null">
    <p>
      Preview:
      <span>{{sku}}</span>
    </p>
    <a-form-model :model="form"></a-form-model>
  </a-modal>
</template>

<script>
// import axios from "axios";

const initForm = {};

export default {
  props: {
    visible: Boolean
  },
  data() {
    return {
      form: { ...initForm },
      sku: null
    };
  },
  async mounted() {},

  methods: {}
};
</script>

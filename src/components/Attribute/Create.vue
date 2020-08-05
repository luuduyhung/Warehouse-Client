<template>
  <div>
    <a-modal :visible="visible" :footer="null" title="Create Attribute" :closable="false">
      <a-input v-model="attributeName" placeholder="Enter attribute name" />
      <a-button type="primary" @click="createAttribute">Add attribute</a-button>
      <a-button @click="handleCancel">Cancel</a-button>
    </a-modal>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      attributeName: null
    };
  },
  props: {
    visible: Boolean,
    handleCancel: Function,
    addAttribute: Function
  },
  methods: {
    async createAttribute() {
      const { data } = await axios.post(
        "http://localhost:5000/product/attributes",
        {
          name: this.attributeName
        }
      );
      this.addAttribute(data);
      this.handleCancel();
    }
  }
};
</script>
<template>
  <span>
    <a @click="showImport">Transfer</a>
    <a-modal title="Transfer" v-model="visible" :footer="null">
      <a-form-model :model="form">
        <a-form-model-item label="Destination warehouse">
          <a-select v-model="form.DestinationWhId" placeholder="Select warehouse">
            <a-select-option v-for="w in warehouses" :key="w.id">{{w.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-for="(item,index) in form.productItems" :key="index">
          <a-row>
            <a-col :span="12">
              <a-input-search
                v-model="item.sku"
                placeholder="Sku"
                enter-button
                @search="(val)=>onSearch(val, index)"
              />
            </a-col>
            <a-col :span="5">
              <a-input-number :min="0" v-model="item.quantity" placeholder="Quantity" />
            </a-col>
            <a-col
              v-if="item.inStock !== null"
              :span="4"
              style="margin-left: 10px"
            >In stock: {{item.inStock}}</a-col>
            <a-col :span="2">
              <a-icon
                v-if="form.productItems.length > 1"
                type="minus-circle-o"
                :disabled="form.productItems.length === 1"
                style="margin-left: 10px, cursor:pointer"
                @click="removeItem(index)"
              />
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-button type="primary" @click="addProductItem">Add item</a-button>
        <a-button type="primary" @click="handleImport">Transfer</a-button>
      </a-form-model>
    </a-modal>
  </span>
</template>

<script>
import axios from "axios";

const initForm = {
  DestinationWhId: null,
  productItems: [
    {
      sku: null,
      quantity: null,
      inStock: null
    }
  ]
};

export default {
  props: {
    stock: Object
  },
  data() {
    return {
      form: { ...initForm },
      warehouses: [],
      visible: false
    };
  },
  async mounted() {
    const { data } = await axios.get("http://localhost:5000/warehouse");
    this.warehouses = data;
  },
  beforeDestroy() {
    this.form = initForm;
  },
  methods: {
    async onSearch(val = "", index) {
      //   console.log(val, index);
      try {
        const { data } = await axios.get(
          `http://localhost:5000/warehouse/${this.stock.id}/productItems/${val}`
        );
        this.form.productItems[index].inStock = data;
      } catch (e) {
        if (e.response.status == 404) {
          alert("Item not found");
        }
      }
    },
    showImport() {
      this.visible = true;
    },
    removeItem(i) {
      this.form.productItems.splice(i, 1);
    },
    addProductItem() {
      this.form.productItems.push({
        sku: null,
        quantity: null,
        inStock: null
      });
    },
    async handleImport() {
      const SourceWhId = this.stock.id;
      const DestinationWhId = this.form.DestinationWhId;
      const productItems = this.form.productItems.map(({ sku, quantity }) => ({
        sku,
        quantity
      }));
      await axios.post("http://localhost:5000/warehouse/transfer", {
        SourceWhId,
        DestinationWhId,
        productItems
      });
      this.form = initForm;
      this.visible = false;
    }
  }
};
</script>

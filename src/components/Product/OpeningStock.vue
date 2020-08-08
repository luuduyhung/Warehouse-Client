<template>
  <a-card title="Opening stock">
    <a-form-model :model="form">
      <a-row>
        <a-col :span="8">
          <h3>Item name</h3>
        </a-col>
        <a-col :span="8">
          <h3>Warehouse name</h3>
        </a-col>
        <a-col :span="8">
          <h3 style="display: inline;">Opening stock</h3>
          <a @click="copyOpeningStock" style="margin-left: 10px">Copy to all</a>
        </a-col>
      </a-row>
      <a-form-model-item v-for="(item,index) in form.importForm" :key="index">
        <a-row>
          <a-col :span="8">
            <p>{{item.name}}</p>
          </a-col>
          <a-col :span="15">
            <a-row v-for="(openingStock,i) in item.import" :key="i">
              <a-col :span="11">
                <a-select
                  v-model="openingStock.DestinationWhId"
                  :defaultValue="openingStock.DestinationWhId"
                >
                  <a-select-option v-for="wh in warehouses" :key="wh.id">{{wh.name}}</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="4" style="margin-left: 50px">
                <a-input-number v-model="openingStock.quantity" :default-value="0" />
              </a-col>
              <a-col :span="2">
                <a-icon
                  v-if="item.import.length > 1"
                  type="minus-circle-o"
                  :disabled="item.import.length === 1"
                  style="margin-left: 20px"
                  @click="removeOpeningStock(item,i)"
                />
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="1">
            <a-icon type="plus-circle" @click="addOpeningStock(item)" />
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-button @click="handleBack">Back</a-button>
      <a-button type="primary" @click="handleSubmit">Save</a-button>
    </a-form-model>
  </a-card>
</template>

<script>
import Axios from "axios";
export default {
  props: {
    items: Array,
    handleBack: Function
  },
  data() {
    return {
      form: {
        importForm: []
      },
      warehouses: []
    };
  },
  async mounted() {
    const { data } = await Axios.get("http://localhost:5000/warehouse");
    this.warehouses = data;
    this.form.importForm = this.items.map(item => ({
      name: item.name,
      sku: item.sku,
      import: [
        {
          DestinationWhId: this.warehouses[0].id,
          quantity: 0
        }
      ]
    }));
  },
  methods: {
    removeOpeningStock(importForm, i) {
      importForm.import.splice(i, 1);
    },
    addOpeningStock(importForm) {
      importForm.import.push({
        DestinationWhId: this.warehouses[0].id,
        quantity: 0
      });
    },
    copyOpeningStock() {
      const anchor = this.form.importForm[0].import[0].quantity;
      this.form.importForm.forEach(impForm =>
        impForm.import.forEach(wh => {
          wh.quantity = anchor;
        })
      );
    },
    async handleSubmit() {
      const {
        form: { importForm }
      } = this;
      // [
      // 	{
      // 		DestinationWhId: 1,
      // 		productItems: [
      //   		{
      //       sku: "TEE-SUP-RED-XL",
      //       quantity: 5
      //   		}
      // 		]
      // 	}
      // ]
      let warehouseImport = [];
      for (const form of importForm) {
        const whs = form.import;
        for (const wh of whs) {
          const foundIndex = warehouseImport.findIndex(
            whIp => whIp.DestinationWhId === wh.DestinationWhId
          );
          if (foundIndex === -1) {
            warehouseImport.push({
              DestinationWhId: wh.DestinationWhId,
              productItems: [
                {
                  sku: form.sku,
                  quantity: wh.quantity
                }
              ]
            });
          } else {
            warehouseImport[foundIndex].productItems.push({
              sku: form.sku,
              quantity: wh.quantity
            });
          }
        }
      }
      try {
        for (const whIp of warehouseImport) {
          await Axios.post("http://localhost:5000/warehouse/import", whIp);
        }
        alert("import successfully");
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>

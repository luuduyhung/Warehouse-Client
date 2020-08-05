<template>
  <a-table :columns="columns" :data-source="items" :rowKey="(record) => record.sku">
    <!-- <span slot="action" slot-scope="text, record">
      <a-button type="danger" @click="handleDelete(record.id)">Delete</a-button>
    </span>-->
    <p
      slot="expandedRowRender"
      slot-scope="record"
      style="margin: 0"
    >{{ record.attributes.map(({name,value})=>({[name]: value})) }}</p>
  </a-table>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

const columns = [
  {
    dataIndex: "sku",
    title: "SKU"
  },
  {
    title: "Name",
    dataIndex: "name"
  },
  {
    title: "Price",
    dataIndex: "price"
  }
  //   {
  //     title: "Action",
  //     scopedSlots: { customRender: "action" }
  //   }
];

export default {
  name: "Item",
  data() {
    return {
      columns,
      items: []
    };
  },
  //   computed: {
  //     attributes(att) {
  //       return att.map(a => `<span>${[a.name]}: ${[a.value]}</span>`);
  //     }
  //   },
  async mounted() {
    const { data } = await axios.get(
      "http://localhost:5000/product/productItem"
    );
    this.items = data;
  }
};
</script>

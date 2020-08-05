<template>
  <a-table
    :columns="columns"
    :data-source="stocks"
    :rowKey="(record) => record.id"
    class="components-table-demo-nested"
  >
    <span slot="action" slot-scope="text, record">
      <Import :stock="record" />
      <a-divider type="vertical" />
      <Export :stock="record" />
      <a-divider type="vertical" />
      <Transfer :stock="record" />
    </span>
    <a-table
      slot="expandedRowRender"
      slot-scope="record"
      :columns="innerColumns"
      :data-source="record.products"
      :rowKey="(innerRecord) => innerRecord.sku"
      :pagination="false"
      size="small"
    ></a-table>
  </a-table>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import Import from "../components/Stock/Import";
import Export from "../components/Stock/Export";
import Transfer from "../components/Stock/Transfer";

const columns = [
  {
    dataIndex: "id",
    title: "Id"
  },
  {
    title: "Name",
    dataIndex: "name"
  },
  {
    title: "Address",
    dataIndex: "address"
  },
  {
    title: "Action",
    scopedSlots: { customRender: "action" }
  }
];

const innerColumns = [
  {
    dataIndex: "sku",
    title: "Sku"
  },
  {
    title: "Quantity",
    dataIndex: "quantity"
  }
];

export default {
  name: "Stock",
  components: {
    Import,
    Export,
    Transfer
  },
  data() {
    return {
      columns,
      innerColumns,
      stocks: []
    };
  },
  async mounted() {
    const { data } = await axios.get("http://localhost:5000/warehouse");
    for (const stock of data) {
      const {
        data: { products }
      } = await axios.get(
        `http://localhost:5000/warehouse/${stock.id}/productItems`
      );
      this.stocks.push({
        id: stock.id,
        name: stock.name,
        address: stock.address,
        products
      });
    }
    console.log(this.stocks);
  }
};
</script>

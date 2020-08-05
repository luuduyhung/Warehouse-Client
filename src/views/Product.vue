<template>
  <div>
    <div>
      <router-link to="/productCreate">
        <a-button>Create</a-button>
      </router-link>
      <!-- <a-modal
        title="Create product"
        :visible="createVisible"
        :footer="null"
        @cancel="handleCancelCreate"
      >
        <CreateForm :handleCancelCreate="handleCancelCreate" :data="data" />
      </a-modal>-->
    </div>
    <a-table :columns="columns" :data-source="data" :rowKey="(record) => record.id">
      <span slot="action" slot-scope="text, record">
        <a-button type="danger" @click="handleDelete(record.id)">Delete</a-button>
      </span>
      <a slot="category" slot-scope="text">{{ text }}</a>
    </a-table>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

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
    title: "Price",
    dataIndex: "price"
  },
  {
    title: "Category",
    dataIndex: "category.name",
    scopedSlots: { customRender: "category" }
  },
  {
    title: "Action",
    scopedSlots: { customRender: "action" }
  }
];

export default {
  name: "Product",
  components: {},
  data() {
    return {
      data: [],
      columns,
      createVisible: false,
      importVisible: false,
      exportVisible: false
    };
  },
  // watch: {
  //   data: function(val) {
  //     console.log(val);
  //   },
  // },
  methods: {
    showCreate() {
      this.createVisible = true;
    },
    showImport() {
      this.importVisible = true;
    },
    showExport() {
      this.exportVisible = true;
    },
    handleCancelCreate() {
      this.createVisible = false;
    },
    handleCancelImport() {
      this.importVisible = false;
    },
    handleCancelExport() {
      this.exportVisible = false;
    },
    async handleDelete(id) {
      await axios.delete(`http://localhost:5000/product/${id}`);
      this.data = this.data.filter(e => e.id !== id);
    }
  },
  async mounted() {
    const { data } = await axios.get("http://localhost:5000/product");
    this.data = data;
  }
};
</script>

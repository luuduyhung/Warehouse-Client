<template>
  <a-card title="General">
    <a-form-model :model="form">
      <a-form-model-item label="Name">
        <a-input v-model="form.name" placeholder="Enter product name" />
      </a-form-model-item>
      <a-form-model-item label="Category">
        <a-select v-model="form.categoryId" placeholder="Select category">
          <a-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">{{cat.name}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <b>Attributes</b>
      <a-form-model-item v-for="(attribute,index) in form.attributeForm.attributes" :key="index">
        <a-row>
          <a-col :span="6">
            <a-select v-model="attribute.name" show-search placeholder="Eg: Color">
              <div slot="dropdownRender" slot-scope="menu">
                <v-nodes :vnodes="menu" />
                <a-divider style="margin: 4px 0;" />
                <div
                  style="padding: 4px 8px; cursor: pointer;"
                  @mousedown="e => e.preventDefault()"
                  @click="createNewAttribute"
                >
                  <a-icon type="plus" />Or add a new one
                </div>
                <AttributeCreateModal
                  :visible="attributeCreateVisible"
                  :handleCancel="attributeCreateCancel"
                  :addAttribute="addAttributes"
                />
              </div>
              <a-select-option v-for="att in attributes" :key="att.name">{{att.name}}</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="16">
            <a-select mode="tags" v-model="attribute.value" placeholder="Attribute Value"></a-select>
          </a-col>
          <a-col :span="2">
            <a-icon
              v-if="form.attributeForm.attributes.length > 1"
              type="minus-circle-o"
              :disabled="form.attributeForm.attributes.length === 1"
              style="margin-left: 20px"
              @click="removeAttribute(index)"
            />
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-button type="primary" @click="addAttribute">Add attribute</a-button>
      <a-form-model-item>
        <b>Items</b>
        <a-row>
          <a-col :span="8">
            <p>Name</p>
          </a-col>
          <a-col :span="8">
            <p>
              Sku
              <a style="margin-left: 10px" @click="openSkuModal">Generate SKU</a>
            </p>
            <GenerateSkuModal
              :handleCancel="closeSkuModal"
              :visible="generateSkuModalVisible"
              :sample="items[0]"
              :productName="form.name"
              :attributes="form.attributeForm.attributes"
              :handleGenerate="handleGenerate"
            />
          </a-col>
          <a-col :span="6">
            <p>
              Price
              <a @click="copyPrice" style="margin-left: 10px">Copy to all</a>
            </p>
          </a-col>
        </a-row>
        <a-form-model-item v-for="(item,index) in items" :key="index">
          <a-row>
            <a-col :span="8">
              <a-input v-model="item.name" placeholder="Item name" :defaultValue="item.name" />
            </a-col>
            <a-col :span="8">
              <a-input v-model="item.sku" placeholder="Sku" />
            </a-col>
            <a-col :span="8">
              <a-input-number v-model="item.price" placeholder="Price" style="width: 150px" />
            </a-col>
          </a-row>
        </a-form-model-item>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" @click="submitForm">Save & Next</a-button>
        <router-link to="/product">
          <a-button style="margin-left: 10px">Cancel</a-button>
        </router-link>
      </a-form-model-item>
    </a-form-model>
  </a-card>
</template>

<script>
import axios from "axios";
import generateSku from "../utils/generateSku";
import AttributeCreateModal from "../components/Attribute/Create";
import GenerateSkuModal from "../components/Product/GenerateSku";

const initForm = {
  name: "",
  categoryId: null,
  attributeForm: {
    attributes: [
      {
        name: null,
        value: []
      }
    ]
  }
};

export default {
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    },
    AttributeCreateModal,
    GenerateSkuModal
  },
  props: {
    handleNext: Function
  },
  data() {
    return {
      categories: [],
      attributes: [],
      items: [],
      form: { ...initForm },
      attributeCreateVisible: false,
      generateSkuModalVisible: false
    };
  },
  watch: {
    form: {
      handler(val) {
        const attributeValues = val.attributeForm.attributes;
        const generateItems = [];
        function generateItem(variant, index, attributeValues) {
          if (index >= attributeValues.length) {
            generateItems.push(variant);
          } else {
            for (const av of attributeValues[index]) {
              generateItem(variant.concat(av), index + 1, attributeValues);
            }
          }
        }
        generateItem(
          [],
          0,
          attributeValues.map(a => a.value)
        );
        // const name = this.form.name.substring(0, 3);
        this.items = generateItems.map(item => {
          // let attSku = name;
          // item.forEach(i => (attSku += `-${i.substring(0, 3)}`));
          return {
            sku: "",
            name: this.itemName(item),
            price: null,
            attributeValues: item
          };
        });
      },
      deep: true
    }
  },
  async mounted() {
    const [{ data: categories }, { data: attributes }] = await Promise.all([
      axios.get("http://localhost:5000/category"),
      axios.get("http://localhost:5000/product/attributes")
    ]);
    this.categories = categories;
    this.attributes = attributes;
  },
  methods: {
    openSkuModal() {
      this.generateSkuModalVisible = true;
    },
    closeSkuModal() {
      this.generateSkuModalVisible = false;
    },
    itemName(item) {
      let itemName = this.form.name + "-";
      const length = item.length;
      item.forEach((val, i) => {
        itemName += val;
        if (i < length - 1) {
          itemName += "/";
        }
      });
      return itemName;
    },
    addAttributes(att) {
      this.attributes.push(att);
    },
    createNewAttribute() {
      this.attributeCreateVisible = true;
    },
    attributeCreateCancel() {
      this.attributeCreateVisible = false;
    },
    async submitForm() {
      const {
        name,
        categoryId,
        attributeForm: { attributes }
      } = this.form;
      const items = this.items;
      try {
        await axios.post("http://localhost:5000/product", {
          name,
          categoryId,
          attributes,
          items
        });
        this.handleNext(items);
      } catch (e) {
        console.error(e);
      }
    },
    addAttribute() {
      this.form.attributeForm.attributes.push({ name: null, value: [] });
    },
    removeAttribute(index) {
      this.form.attributeForm.attributes.splice(index, 1);
    },
    handleGenerate(rules) {
      const productName = this.form.name;
      this.items.forEach(item => {
        item.sku = generateSku(rules, productName, item.attributeValues);
      });
      this.generateSkuModalVisible = false;
    },
    copyPrice() {
      this.items.forEach(item => (item.price = this.items[0].price));
    }
  }
};
</script>

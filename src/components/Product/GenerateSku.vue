<template>
  <a-modal title="Generate SKU" :visible="visible" :footer="null">
    <div>
      Preview:
      <h1>{{preview()}}</h1>
    </div>
    <a-form-model :model="form">
      <a-form-model-item v-for="(rule,index) in form.generateRuleForm" :key="index">
        <a-row>
          <a-col :span="8">
            <a-select v-model="rule.key" :value="rule.key">
              <a-select-option value="PN">Product name</a-select-option>
              <a-select-option v-for="(att,i) in attributes" :key="i" :value="i">{{att.name}}</a-select-option>
              <a-select-option value="CV">Custom value</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="10" v-if="rule.key==='CV'">
            <a-input v-model="rule.value" />
          </a-col>
          <a-col :span="10" v-else>
            <a-col :span="12">
              <a-select v-model="rule.show[0]" :default-value="0">
                <a-select-option :value="0">First</a-select-option>
                <a-select-option :value="1">Last</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="12">
              <a-input-number v-model="rule.show[1]" placeholder="Letter" :default-value="3" />
            </a-col>
          </a-col>
          <a-col :span="2">
            <a-icon
              v-if="attributes.length > 1"
              type="minus-circle-o"
              :disabled="attributes.length === 1"
              style="margin-left: 10px"
              @click="removeItem(index)"
            />
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-button type="primary" @click="addRule">Add rule</a-button>
    </a-form-model>
    <a-row>
      <a-col :span="5">
        <a-button type="primary" @click="handleSubmit">Generate</a-button>
      </a-col>
      <a-col :span="5">
        <a-button @click="handleCancel">Cancel</a-button>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import generateSku from "../../utils/generateSku";

export default {
  props: {
    visible: Boolean,
    sample: Object,
    productName: String,
    handleCancel: Function,
    attributes: Array,
    handleGenerate: Function
  },
  data() {
    return {
      form: {
        generateRuleForm: [
          {
            key: "PN",
            show: [0, 3]
          }
        ]
      }
    };
  },
  watch: {
    attributes: {
      handler(val) {
        this.form.generateRuleForm.length = val.length;
        val.forEach((av, i) => {
          this.form.generateRuleForm[i + 1] = {
            key: i,
            show: [0, 3]
          };
        });
      },
      deep: true
    }
  },
  methods: {
    removeItem(i) {
      this.form.generateRuleForm.splice(i, 1);
    },
    addRule() {
      this.form.generateRuleForm.push({
        key: "CV",
        show: [0, 3]
      });
    },
    preview() {
      let {
        form: { generateRuleForm },
        productName
      } = this;
      let av = this.sample
        ? this.sample.attributeValues
          ? this.sample.attributeValues
          : [""]
        : [""];
      // console.log("****generateRuleForm", generateRuleForm);
      // console.log("sku", generateSku(generateRuleForm, productName, av));
      // console.log(av);
      return generateSku(generateRuleForm, productName, av);
    },
    handleSubmit() {
      this.handleGenerate(this.form.generateRuleForm);
    }
  }
};
</script>

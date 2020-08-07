module.exports = function(rules, productName, attributeValues) {
  let sku = "";
  let len = rules.length;
  for (let i = 0; i < len; i++) {
    let rule = rules[i];
    if (rule.key === "PN") {
      if (rule.show[0] === 0) {
        sku = sku + productName.substring(0, rule.show[1]);
      } else {
        sku = sku + productName.substring(productName.length - rule.show[1]);
      }
    } else if (rule.key === "CV") {
      sku += rule.value;
    } else {
      let attValue = attributeValues[rule.key];
      if (rule.show[0] === 0) {
        sku += attValue ? attValue.substring(0, rule.show[1]) : "";
      } else {
        sku += attValue
          ? attValue.substring(attValue.length - rule.show[1])
          : "";
      }
    }
    if (i < len - 1) {
      sku += "-";
    }
  }
  return sku.toUpperCase();
};

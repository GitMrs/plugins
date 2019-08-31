<template>
  <div>
    <label v-if="label">{{label}}</label>
    <slot>
        <!-- input -->
    </slot>
    <!-- 错误信息 -->
    <p v-if="error">{{error}}</p>
  </div>
</template>

<script>
/**
 * 用于表单校验
 */
import Schema from "async-validator";
export default {
  inject: ["form"], //接收注入的东西
  data() {
    return {
      error: ""
    };
  },
  props: {
    label: {
      type: String,
      default: ""
    },
    prop: {
      //通过prop获取校验规则
      type: String,
      default: ""
    }
  },
  mounted() {
    //接受穿过来的校验数据
    this.$on("validate", this.validate);
  },
  methods: {
    validate() {
      const rule = this.form.rules[this.prop];
      const value = this.form.model[this.prop];
      //创建描述传入规则
      const descriptor = { [this.prop]: rule };
      const schema = new Schema(descriptor);
      //进行校验
      schema.validate({ [this.prop]: value }, { firstFields: true }, errors => {
        if (errors) {
          this.error = errors[0].message;
        } else {
          this.error = "";
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
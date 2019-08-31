<template>
  <form>
    <slot></slot>
  </form>
</template>

<script>
import Schema from 'async-validator';
export default {
  provide() { //将父级注入到内部组件
    return {
      form: this
    };
  },
  props: {
    model: {
      type: Object
    },
    rules: {
      type: Object
    }
  },
  computed:{
    // formRules(){
    //   let descriptor = {};
    //   this
    // }
  },
  methods:{
    //对数据进行统一配置，暴露出去validate接口
    validate(cb){
      const schema = new Schema(this.rules);
      schema.validate(this.model,errors => {
        if(errors){
          cb(errors[0].message)
        }else{
          cb(null)
        }
      })
    }
  }
};
</script>

<style scoped>
</style>
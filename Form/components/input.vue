<template>
  <div>
    <input :type="type" :value="value" @input="onInput">
  </div>
</template>

<script>
  export default {
    props:{
      value:{
        type:String,
        default:''
      },
      type:{
        type:String,
        default:"text"
      }
    },
    methods:{
      onInput(e){
        //用于数据绑定
        this.$emit('input',e.target.value)
        //给父级派发数据校验
        this.$parent.$emit('validate')
      }
    }
  }
</script>

<style scoped>

</style>
<template>
  <div class="">
    <DatePick v-model="value" />
  </div>
</template>

<script>
import DatePick from './DatePick';
export default {
  name: '',
  data() { 
    return {
      value:new Date()
    }
  },
  components:{
    DatePick
  }
 }
</script>

<style lang="" scoped>
</style>
<template>
  <ul :style="{transform: `rotate(${rotates * -6}deg)`}">
    <li
      v-for="(item,index) in secendList"
      :key="index"
      :class="{hover: index == rotates - 1}"
    >{{ item }}</li>
  </ul>
</template>

<script>
export default {
  name: 'second',
  props: ['second'],
  data() {
    return {
      rotates: '',
    };
  },
  computed: {
    secendList: {
      get() {
        return this.$t('second');
      },
    },
  },
  watch: {
    second(val) {
      this.rotates = val;
    },
  },
};
</script>

<style lang="scss" scoped>
ul {
  z-index: 9;
  @for $i from 1 through 60 {
    li:nth-child(#{$i}) {
      transform: rotate(#{$i * 6}deg) translateX(390px);
    }
  }
}
</style>
<template>
  <div>
    <ul>
      <li>{{years}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'year',
  props: ['year'],
  computed: {
    years() {
      let desc = this.$t('year');
      if (desc) {
        const { heavenlyStems, earthlyBranches } = desc;
        let year = this.year - 3;
        if (year !== -3) {
          return (
            heavenlyStems[(year % 10) - 1] +
            earthlyBranches[(year % 12) - 1] +
            '年'
          );
        } else {
          return '';
        }
      } else {
        return this.year;
      }
      // return this.$t('year');
    },
  },
  watch: {
    year(val) {
      this.year = val;
    },
  },
};
</script>

<style lang="scss" scoped>
ul {
  z-index: 2;

  li {
    transform: translateX(0px);
  }
}
</style>
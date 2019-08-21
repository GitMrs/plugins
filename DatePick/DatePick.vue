<template>
  <div v-click-outside>
    <input type="text" :value="formateDate" />
    <div class="pennel" v-if="visible">
      <div class="pennel-header">
        <span @click="preYear">&lt;</span>
        <span @click="preMonth">&lt;&lt;</span>
        <span>{{year}}年</span>
        <span>{{month}}月</span>
        <span @click="nextMonth">&gt;&gt;</span>
        <span @click="nextYear">&gt;</span>
      </div>
      <div class="pennel-body">
        <div>
          <span v-for="(item)  in week" :key="item">{{item}}</span>
        </div>
        <div v-for="i in 6" :key="i">
          <span
            class="cell"
            @click="changeDay(visibleDate[(i-1) * 7 + (j-1)])"
            :class="[
              {
                notCurrentMouth:isCurrentMouth(visibleDate[(i-1) * 7 + (j-1)]),
                currentDay:currenDay(visibleDate[(i-1) * 7 + (j-1)]),
                selected:selectedDay(visibleDate[(i-1) * 7 + (j-1)])
              }
            ]"
            v-for="j in 7"
            :key="j"
          >{{visibleDate[(i-1) * 7 + (j-1)].getDate()}}</span>
        </div>
      </div>
      <div class="pennel-footer">
        <span @click="getDay">今天</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as util from "./util";
export default {
  name: "",
  directives: {
    clickOutside: {
      //el 绑定元素 binding 参数 vnode虚拟dom
      bind(el, binding, vnode) {
        let handler = e => {
          if (el.contains(e.target)) {
            !vnode.context.visible && vnode.context.focus();
          } else {
            vnode.context.visible && vnode.context.blur();
          }
        };
        el.handler = handler;
        document.addEventListener("click", handler);
      },
      unbind(el) {
        document.removeEventListener("click", el.handler);
      }
    }
  },
  props: {
    value: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      week: ["一", "二", "三", "四", "五", "六", "日"],
      visible: false,
      year: "",
      month: "001595"
    };
  },
  methods: {
    focus() {
      this.visible = true;
    },
    blur() {
      this.visible = false;
    },
    //判断是否是当前月的日期样式
    isCurrentMouth(date) {
      let { year, month } = util.formatDate(this.value);
      let { year: y, month: m } = util.formatDate(date);
      return year !== y || month !== m;
    },
    //当月日期样式
    currenDay(date) {
      let { year, month, day } = util.formatDate(new Date());
      let { year: y, month: m, day: d } = util.formatDate(date);
      return year === y && month === m && day === d;
    },
    //选择日期样式
    selectedDay(date) {
      let { year, month, day } = util.formatDate(this.value);
      let { year: y, month: m, day: d } = util.formatDate(date);
      return year === y && month === m && day === d;
    },
    //选择日期
    changeDay(date) {
      this.$emit("input", date);
    },
    //回到今天
    getDay() {
      this.$emit("input", new Date());
    },
    preYear() {
      let { year, month, day } = util.formatDate(this.value);
      this.$emit("input", new Date(year - 1, month, day));
    },
    nextYear() {
      let { year, month, day } = util.formatDate(this.value);
      this.$emit("input", new Date(year + 1, month, day));
    },
    preMonth() {
      let { year, month, day } = util.formatDate(this.value);
      this.$emit("input", new Date(year, month - 2, day));
    },
    nextMonth() {
      let { year, month, day } = util.formatDate(this.value);
      this.$emit("input", new Date(year, month, day));
    },
    //默认获取年月
    defaultValue(val) {
      let { year, month } = util.formatDate(val);
      this.year = year;
      this.month = month;
    }
  },
  computed: {
    formateDate() {
      let { year, month, day } = util.formatDate(this.value);
      return year + "-" + month + "-" + day;
    },
    //日历的核心算法 获取的年月，找到当月的1号是周几(例如周三，找到当前的月份的一号时间戳减去2天的时间戳即可得到日历本月开头)
    visibleDate() {
      let { year, month } = util.formatDate(this.value);
      let currentFirstDay = util.getDate(year, month - 1, 1);
      let week = currentFirstDay.getDay() - 1;
      week = week > 0 ? week : 6;
      let startDay = currentFirstDay - week * 60 * 60 * 24 * 1000;
      let visibleDay = [];
      for (let i = 0; i < 42; i++) {
        visibleDay.push(new Date(startDay + i * 60 * 60 * 24 * 1000));
      }
      return visibleDay;
    }
  },
  watch: {
    value(val) {
      this.defaultValue(val);
    }
  },
  mounted() {
    this.defaultValue(this.value);
  }
};
</script>

<style lang="sass" scoped>
  .pennel
    position: relative
    top: 0
    width: 7*32px
    box-shadow: 2px 2px 2px #ccc, -2px -2px 2px #ccc
    .pennel-header
      display: flex
      justify-content: space-around
      height: 30px
      line-height: 30px
      span
        cursor: pointer
        user-select: none
    .pennel-body
      span 
        display: inline-flex
        justify-content: center
        align-items: center
        box-sizing: border-box
        width: 32px
        height: 32px
        color: #000
      .notCurrentMouth
        color: #999
      .currentDay
        background: red
        color: #fff
        border-radius: 5px
      .selected
        border: 1px solid red
      .cell:hover
        border: 1px solid pink
    .pennel-footer
      height: 30px
      text-align: center
</style>
<template>
  <div class="home">
    <Second :second="second" />
    <Minute :minute="minute" />
    <Huor :hour="hour" />
    <Apm :apm="apm" />
    <Week :week="week" />
    <Day :day="day" />
    <Month :month="month" />
    <Year :year="year" />
    <!-- <Setting /> -->
  </div>
</template>

<script>
import Second from './components/second';
import Minute from './components/minute';
import Huor from './components/huor';
import Apm from './components/apm';
import Week from './components/week';
import Day from './components/day';
import Month from './components/month';
import Year from './components/year';
import Setting from './components/setting/index';

export default {
  name: 'Clock',
  data() {
    return {
      second: '',
      minute: '',
      hour: '',
      apm: '',
      week: '',
      day: '',
      month: '',
      year: '',
    };
  },
  components: {
    Second,
    Minute,
    Huor,
    Apm,
    Week,
    Day,
    Month,
    Year,
    Setting,
  },
  created() {
    this.start();
  },
  methods: {
    // init() {
    //   let data = new Date();
    //   this.second = data.getSeconds();
    // }
    start() {
      setInterval(() => {
        let data = new Date();
        this.second = data.getSeconds();
        this.minute = data.getMinutes();
        this.hour = data.getHours();
        this.week = data.getDay();
        this.day = data.getDate();
        this.month = data.getMonth() + 1;
        this.year = data.getFullYear();
        if (this.hour > 12) {
          this.apm = 2;
        } else {
          this.apm = 1;
        }
      }, 1000);
    },
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  min-height: 0;
  min-width: 0;
}
*:focus {
  outline: none;
}
body {
  overflow: hidden;
  background-color: #000;
}

.home {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  ul {
    list-style-type: none;
    padding: 0;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 60px;
    width: 60px;
    transition: 0.1s 0.1s ease-in;
    li {
      position: absolute;
      height: 60px;
      width: 60px;
      color: #fff;
      text-align: center;
      font-size: 14px;
      line-height: 60px;
      &.hover {
        text-shadow: rgb(255, 255, 255) 0px 0px 10px,
          rgb(255, 255, 255) 0px 0px 20px, rgb(255, 0, 222) 0px 0px 30px,
          rgb(255, 0, 222) 0px 0px 40px, rgb(255, 0, 222) 0px 0px 70px,
          rgb(255, 0, 222) 0px 0px 80px, rgb(255, 0, 222) 0px 0px 100px;
      }
    }
  }
}
</style>
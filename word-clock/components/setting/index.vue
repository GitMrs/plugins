<template>
  <div class="set_wrap">
    <div class="title">{{ $t('settingData.title') }}</div>
    <div class="about_me">
      <span>无名草</span>
      <a href="https://github.com/HongqingCao">codercao</a>
    </div>
    <div class="btn_set">
      <span class="iconfont-iconshezhi"></span>
    </div>
    <div class="btn_show">
      <span
        class="iconfont iconquanping"
        @click="screenfullClick"
      ></span>
      <span class="iconfont iconpcduan"></span>
    </div>
    <div class="content">
      <setLang />
      <!-- <setSize />
      <setLeft />
      <setTop /> -->
    </div>
  </div>
</template>

<script>
import screenfull from 'screenfull';
import setLang from './setLang';
import setLeft from './setLeft';
import setTop from './setTop';
import setSize from './setSize';
export default {
  name: 'Set',
  props: ['week'],
  components: {
    setLang,
    setLeft,
    setTop,
    setSize,
  },
  data() {
    return {
      isFullscreen: false,
    };
  },
  methods: {
    screenfullClick() {
      if (!screenfull.enabled) {
        return false;
      }
      screenfull.toggle();
    },
  },
};
</script>

<style lang="scss" scoped>
.set_wrap {
  z-index: 10;
  position: fixed;
  top: 20px;
  width: 250px;
  color: #fff;
  .title {
    padding-left: 20px;
    font-size: 36px;
    color: #fff;
    opacity: 0.9;
  }
  .about_me {
    padding-left: 20px;
    span {
      font-size: 12px;
      color: #666;
      opacity: 0.5;
    }
    a {
      font-size: 14px;
      color: #666;
      opacity: 0.6;
    }
  }
  .btn_show {
    position: absolute;
    padding: 10px 0 10px 15px;
    left: 40px;
    opacity: 0.6;
    margin-bottom: 10px;
    span {
      font-size: 28px;
      margin-right: 10px;
    }
  }
  .btn_set {
    @extend .btn_show;
    left: 0px;
    &:hover ~ .content {
      margin-left: 0px;
    }
  }
  .content {
    position: absolute;
    height: 300px;
    width: 250px;
    padding: 10px;
    margin-top: 40px;
    margin-left: -272px;
    transition: margin-left 0.9s;
    font-size: 14px;
    border: 1px solid hsla(0, 0%, 10%, 0.2);
    border-radius: 20%;
    background-color: hsla(0, 0%, 10%, 0.1);
    .set_com {
      .set_title {
        opacity: 0.9;
        padding: 5px;
      }
      .set_list {
        margin: 15px 0 15px 0;
        label {
          padding: 5px;
          opacity: 0.7;
        }
        span {
          margin-left: 5px;
          opacity: 0.5;
        }
      }
    }
    &:hover {
      margin-left: 0px;
    }
    &:hover ~ .btn_show {
      right: 0;
    }
  }
}
</style>
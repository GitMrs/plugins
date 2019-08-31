<template>
  <div>
    <!-- <el-form :model="model" :rules="rules" ref="form">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="model.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="model.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="submitForm('form')">提交</el-button>
      </el-form-item>
    </el-form>-->
    <inputForm :model='model' ref="form" :rules="rules">
      <inputItem label="用户名" prop="username">
        <inputVue type="text" v-model="model.username" />
      </inputItem>
      <inputItem label="密码" prop="password">
        <inputVue type="password" v-model="model.password" />
      </inputItem> 
    </inputForm>
    <button @click="submitForm('form')">提交</button> 
  </div>
</template>

<script>
import inputVue from "./components/input.vue";
import inputItem from "./components/item";
import inputForm from "./components/Form";
export default {
  data() {
    return {
      model: {
        username: "1111",
        password: "1111"
      },
      rules: {
        username: { required: true, message: "用户名不能空" },
        password: { required: true, message: "密码不能空" }
      }
    };
  },
  methods: {
    submitForm(form) {
      // console.log(111)
      this.$refs[form].validate(valid => {
        if (valid) {
 
        } else {

        }
      });
    }
  },
  components: {
    inputVue,
    inputItem,
    inputForm
  }
};
</script>

<style lang="scss" scoped>
</style>
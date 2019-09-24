<template>
  <div>
    <MyTree :data.sync="data" :fileDrop="fileDrop" :directoryDrop="directoryDrop" :deleteFn="deleteFn" />
  </div>
</template>

<script>
import { getTreeList } from "./api";
import MyTree from "./components/MyTree";
export default {
  name: "",
  data() {
    return {
      data: [],
      fileDrop: [{ text: "rm", value: "删除文件" }],
      directoryDrop: [
        { text: "rn", value: "修改文件夹" },
        { text: "rm", value: "删除文件夹" }
      ]
    };
  },
  async mounted() {
    let { data } = await getTreeList();
    data.data.parent.forEach(p => {
      p.type = "parent";
      p.edit = false;
    });
    this.data = [...data.data.parent, ...data.data.child];
  },
  methods: {
    deleteFn(id) {
      return new Promise((resolve, reject) => {
        setTimeout(id => {
          resolve();
        }, 3000);
      });
    }
  },
  components: {
    MyTree
  }
};
</script>

<style lang="" scoped>
</style>
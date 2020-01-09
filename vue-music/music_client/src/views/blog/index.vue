<template>
  <div>
    <el-table v-loading="loading" :data="blogList" stripe>
      <el-table-column type="index" width="50px"></el-table-column>
      <el-table-column prop="content" label="内容"></el-table-column>
      <el-table-column prop="nickName" label="发布人"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="onDialog(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="dialogVisible">
      <span>是否确认删除？</span>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="doDel">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const MAX_COUNT = 10;
import { getBlogList, delBlogList } from "@/api/blog";
export default {
  data() {
    return {
      blogList: [],
      loading: false,
      dialogVisible: false,
      blogId: ""
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getBlogList({
        start: this.blogList.length,
        count: MAX_COUNT
      }).then(res => {
        const data = res.data;
        let _blogList = data.map(item => JSON.parse(item));
        this.blogList = this.blogList.concat(_blogList);
      });
    },
    onDialog(row) {
      this.dialogVisible = true;
      this.blogId = row._id;
    },
    doDel() {
      delBlogList({ id: this.blogId }).then(res => {
        if(res.data.deleted > 0){
          this.$message.success('删除成功');
          this.dialogVisible = false;
          this.blogList = [];
          this.getList();
        }else{
           this.$message.error('删除失败');
        }
      });
    }
  }
};
</script>

<style></style>

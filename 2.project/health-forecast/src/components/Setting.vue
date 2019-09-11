<template>
  <div class="setting">
    <el-button type="primary" icon="el-icon-plus" @click="addData()">新增数据</el-button>
    <el-button type="danger" icon="el-icon-delete" @click="deleteData()">批量删除</el-button>
    <hr>
    <el-table
    ref="multipleTable"
    :data="healthData.slice(start,end)"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="日期"
        width="180">
        <template slot-scope="scope">
          <div  v-if="scope.row.edit">
            <el-date-picker
            v-model="scope.row.date"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
            </el-date-picker>
          </div>
          <div v-else>
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </div>
        </template>
        <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
      </el-table-column>
      <el-table-column
        label="体重(Kg)"
        width="120">
        <template slot-scope="scope">
          <el-input v-if="scope.row.edit" v-model="scope.row.weight" placeholder="请输入体重"></el-input>
          <el-input v-else :value="scope.row.weight" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            :disabled="scope.row.edit"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="success"
            v-if="scope.row.edit"
            @click="handleSave(scope.$index, scope.row)">保存</el-button>
          <el-button
            size="mini"
            type="danger"
            v-else
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <hr>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="healthData.length">
    </el-pagination>
  </div>
</template>

<script>
import api from '@/common/api.js'
export default {
  data() {
    return {
      mode: false,
      isUpdate: true,
      isSave: true,
      pageSize: 5,
      start: 0,
      end: 5,
      currentPage: 1,
      tableData:[],
      healthData: [],
      multipleSelection: []
    }
  },
  created(){
    this.getData();
  },
  methods: {
    getData(){
      api.getHealthData().then((res)=>{
        console.log('query res',res);
        res.forEach((item,index)=>{
          this.$set(item,'edit',false);
        })
        this.healthData = res;
        this.handleCurrentChange(1);
      })
    },
    addData(){
      let dateObj = new Date();
      let year = dateObj.getFullYear();
      let month = dateObj.getMonth()+1;
      month < 10 ? month='0'+month :'';
      let date = dateObj.getDate();
      date < 10 ? date='0'+date :'';
      this.healthData.unshift({
        date: `${year}-${month}-${date}`,
        weight: '60.0'
      })
      this.isUpdate = false;
      this.handleEdit(0);
    },
    deleteData(){
      let temp = [];
      this.healthData.forEach((item,index)=>{
        let flag = true;
        this.multipleSelection.forEach((sitem,sindex)=>{
          if(item.date === sitem.date){
            flag = false;
          }
        })
        flag ? temp.push(item):'';
      });
      this.healthData = temp;
      this.handleCurrentChange(this.currentPage);
      this.$message({
        message: '批量删除成功!',
        center: true,
        showClose: true,
        duration: 1000,
        type: 'warning'
      });
    },
    handleEdit(index, row) {
      if(this.isSave===true){
        this.$set(this.healthData[index],'edit',true);
        this.isSave = false;
      }else{
        this.$message({
          type: 'error',
          center: true,
          showClose: true, 
          duration: 1000,
          message: '请先保存数据!'
        });
      }
    },
    handleSave(index, row) {
      this.isSave = true;
      this.healthData[index].edit = false;
      let repeat = this.healthData.filter((sitem,sindex)=>sitem.date === this.healthData[index].date);
      console.log('repeat',repeat);
      if(index===0&&repeat.length<2&&!this.isUpdate){
        console.log('insert',index);
        api.insertHealthData({
          date: this.healthData[index].date.replace(/-/g,''),
          weight: this.healthData[index].weight
        }).then((res)=>{
          console.log('insert res',res);
          this.$message({
            message: '保存数据成功!',
            center: true,
            showClose: true,
            duration: 1000,
            type: 'success'
          });
        })
      }else{
        console.log('update',index);
        api.updateHealthData({
          date: this.healthData[index].date.replace(/-/g,''),
          weight: this.healthData[index].weight
        }).then((res)=>{
          console.log('update res',res);
          this.$message({
            message: '更新数据成功!',
            center: true,
            showClose: true,
            duration: 1000,
            type: 'success'
          });
        })
      }
      this.isUpdate = true;
    },
    handleDelete(index, row) {
      console.log(index, row);
      api.deleteHealthData({
        date: this.healthData[index].date.replace(/-/g,''),
        weight: this.healthData[index].weight
      }).then((res)=>{
        console.log('delete res',res);
        this.healthData.splice(index,1);
        this.handleCurrentChange(this.currentPage);
        this.$message({
          message: '删除成功!',
          center: true,
          showClose: true,
          duration: 1000,
          type: 'warning'
        });
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      let start = this.pageSize*(this.currentPage-1);
      let end = start + this.pageSize;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.start = this.pageSize*(this.currentPage-1);
      this.end = this.start + this.pageSize;
    }
  },
  // insertData(){
  //   api.insertHealthData().then((res)=>{
  //     console.log('insert res',res);
  //   })
  // },
  // deleteData(){
  //   api.deleteHealthData().then((res)=>{
  //     console.log('delete res',res);
  //   })
  // },
  // updateData(){
  //   api.updateHealthData().then((res)=>{
  //     console.log('update res',res);
  //   })
  // },
  // queryData(){
  //   api.getHealthData().then((res)=>{
  //     console.log('query res',res);
  //   })
  // }
}
</script>

<style lang="less" scoped>
  .setting{
    width: 100%;
    height: 100%;
    padding: 10px 6px;
    box-sizing: border-box;
    border: 2px dotted red;
    /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 160px;
    }
  }
</style>

<template>
  <div id="foodPage">
    <!-- <el-container> -->
    <header class="top-header">
      <div class="header-menu" id="find-menu">
        <i class="fa fa-th"></i>
        <span>发现</span>
      </div>
      <div class="header-menu" id="search-menu">
        <i class="fa fa-dot-circle-o"></i>
        <span><router-link :to="{path:'./'}">搜索</router-link></span>
      </div>
    </header>
    <el-container class="el-container-style">
      <el-image :src="id.cover_img" class="cover-img-style img-radius"></el-image>
      <el-header class="el-header-title">{{id.recipe_name}}</el-header>
      <el-main>
        <div class="rate-numbers">
          <el-rate
            v-model="id.rate"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          ></el-rate>
        </div>
        <div class="like-numbers">
          <i class="fa fa-heart" aria-hidden="true">
            <span>&nbsp;&nbsp;{{id.favourite}}</span>
          </i>
        </div>
      </el-main>
      <el-main class = "text">
        <!-- <p>虾仁炒西兰花的营养成分高，而且十分全面，主要包括蛋白质、碳水化合物、脂肪、矿物质、维生素C和胡萝卜素等！</p> -->
        <p>{{id.context}}</p>
      </el-main>
    </el-container>
    <el-container>
      <el-main class="list-main-style">
        <h2>{{id.recipe_name}}的用料</h2>
        <el-header></el-header>
        <el-table
          :data="id.ingredients"
          style="width:600px"
          stripe
          class="el-table-margin el-table-font"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-table-column prop="title" label="用料" width="300"></el-table-column>
          <el-table-column prop="note" label="用量" width="300"></el-table-column>
        </el-table>
      </el-main>
    </el-container>

    <el-container>
      <el-main>
        <h2>{{id.recipe_name}}的制作步骤</h2>
        <div class="mystep">
          <el-header></el-header>
          <el-row>
            <div class="line" v-for="(item,index) in id.steps" :key="item">
              <el-col :span="3" :offset="7">
                <div
                  class="grid-content bg-color bg-size box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"
                >
                  <!-- <img class = "el-row-img-size" src = "../assets/1.jpeg" /> -->
                  <el-image
                    class="el-row-img-size img-radius"
                    :src="item.image"
                    :preview-src-list="srcList"
                  >{{item.image}}</el-image>
                </div>
              </el-col>
              <el-col :span="8" :offset="0">
                <div class="grid-content bg-color bg-size to-leftl">
                  <strong class="strong-align">步骤{{index+1}}</strong>
                  <p class="left-align">{{item.content}}</p>
                </div>
              </el-col>
            </div>
          </el-row>
        </div>
      </el-main>
    </el-container>
    <el-container v-show = "has_tip">
      <el-header>
        <h2>{{id.recipe_name}}的烹饪技巧</h2>
      </el-header>
      <el-main class = "text">
        <p>{{id.tips}}</p>
      </el-main>
    </el-container>
  </div>
  <!-- </el-container> -->
  <!-- </div>   -->
</template>

<script>
export default {
  name: 'HelloWorld',
  sites: [],
  books: [],
  // props: {
  //   msg: String
  // },
  created () {
    this.id = this.$route.query.id
    console.log('test')
    console.log(this.id)
    let imgstr = []
    for (let i = 0; i < this.id.steps.length; i++) {
      imgstr.push(this.id.steps[i].image)
    }
    if (this.id.tips === '') this.has_tip = false

    this.srcList = imgstr
    console.log(this.srcList)
  },
  data () {
    return {
      srcList: [],
      has_tip: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--样式初始化-->
<style scoped>
.left-align {
  text-align: left;
  text-indent: 40px;
  /* display: block; */
}
.strong-align {
  text-align: left;
}
/* .left-span{
  display:block; width: 70px; float:left;
  text-emphasis:yes;
} */
/* .left-span{
  height: 50px;
} */
#foodPage {
  overflow-x: hidden;
  height: 100vh;
  background-color: rgb(254, 254, 254);
  overflow: none;
}

.top-header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 62px;
  z-index: 999;
  box-shadow: 0 2px 6px rgba(10, 10, 10, 0.3);
  background: #fafafa;
}

.header-menu {
  position: fixed;
  margin-top: 21px;
  font-size: large;
  cursor: pointer;
}

#find-menu {
  left: 21%;
}

#search-menu {
  left: 27%;
}

.top-header .search-input {
  background: white;
}

.food-basic-inf {
  display: block;
  width: 70%;
  margin: auto;
  padding: 3%;
  background-color: yellow;
}

.context > p {
  text-align: left;
}

.material {
  display: block;
  width: 70%;
  margin: auto;
}

.table-ctr {
  position: relative;
  display: block;
  margin: auto;
  width: 49%;
  /* 需要完善 */
}

.table-ctr td {
  font-size: 1em;
  border: 1px soild #21bfb4;
  padding: 3px 7px 2px 7px;
  width: 300px;
}

.table-ctr tr.tr-alt td {
  color: #000000;
  background-color: #e9fc1c;
}

.material span.left-text {
  float: left;
  display: block;
}
.material span.right-text {
  float: right;
  display: block;
  color: #fbff00;
}
.step-title {
  width: 50%;
}
.step-title > h2 {
  text-align: left;
}

#food-step {
  width: 70%;
  margin: 0 auto;
}

.container {
  height: 200px;
  width: 90%;
  /* border: 1px solid #f00; */
  /* margin: 0px auto;   */
}
.step-top {
  height: 5px;
  background-color: rgb(240, 233, 26);
}

.step-pic > img {
  width: 200px;
  height: 200px;
  float: left;
}
.step-info {
  width: 540px;
  height: 200px;
  float: right;
  /* box-sizing: border-box; */
}

.step-info > p {
  text-align: left;
}

.tip > p {
  text-align: left;
}
.text > p{
   width:70%;
   margin:auto;
}

.like-numbers {
  display: inline-block;
  margin-top: 5px;
  padding-left: 70px;
}

.like-numbers i{
  color: #d8345f;
}

.rate-numbers {
  display: inline-block;
  margin-top: 5px;
  padding-right: 70px;
}

.to-left {
  text-align: left;
}

</style>

<style>
.cover-img-style {
  width: 700px;
  height: 400px;
  margin: auto;
}
.el-container-style {
  display: inline-block;
  margin: 62px;
}

.bg-color {
  background: #fcffff;
}
.bg-size {
  height: 200px;
  margin: 5px 5px 5px 5px;
}
.el-row-img-size {
  height: 190px;
  width: 200px;
  margin: 10px 10px 10px 10px;
}
.img-radius {
  border-radius: 25px;
}
.el-main-style {
  width: 70%;
}
.list-main-style {
  width: 70%;
}
.el-table-margin {
  margin: auto;
}
.el-header-title {
  font-size: 25px;
  font-weight: bold;
}
.el-table-font {
  font-weight: 900;
}
.el-rate-left {
  display: block;
}

a{
    text-decoration: none;
    color: inherit;
}

.router-link-active {
    text-decoration: none;
}
</style>

<template>
  <div id="foodPage">
    <!-- <el-container> -->
    <header class="top-header">
      <div class="header-menu" id="find-menu">
        <i class="fa fa-th"></i>
        <span><router-link :to="{path:'./'}">主页</router-link></span>
      </div>
      <div class="header-menu" id="search-menu">
        <!-- <i class="fa fa-dot-circle-o"></i> -->
        <i class="fa fa-reply" aria-hidden="true"></i>
        <span><router-link :to="{path:'./'}">返回</router-link></span>
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
      <el-main class = "text" v-show = "has_context">
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
          <el-steps direction="vertical" :active="1">
          <div class="line step-div" v-for="(item,index) in id.steps" :key="index" >
          <el-row type = "flex"  justify="center">
              <el-col :span="6">
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
              <el-col :span="6">
                  <strong class="strong-align">步骤{{index+1}}</strong>
                  <p class="left-align">{{item.content}}</p>
              </el-col>
            <!-- </div> -->
            <!-- </el-steps> -->
          </el-row>
          </div>
          </el-steps>
        </div>
      </el-main>
    </el-container>
    <el-container v-show = "has_tip">
      <el-header>
        <h2>{{id.recipe_name}}的烹饪技巧</h2>
      </el-header>
      <div class = "tip-text">
      <el-main class = "text">
        <p>{{id.tips}}</p>
      </el-main>
      </div>
    </el-container>
  </div>
</template>

<script>
// JSON.parse(this.$route.query.id)
export default {
  name: '',
  sites: [],
  books: [],
  created () {
    let idTemp = this.$route.query
    this.id = JSON.parse(idTemp.id)
    // console.log(this.id)
    console.log('test')
    console.log(this.id)
    let imgstr = []
    for (let i = 0; i < this.id.steps.length; i++) {
      imgstr.push(this.id.steps[i].image)
    }
    if (this.id.tips === '') this.has_tip = false
    if (this.id.has_context === '') this.has_context = false
    this.srcList = imgstr
    console.log(this.srcList)
  },
  data () {
    return {
      srcList: [],
      has_tip: true,
      loading: false,
      has_context: true
    }
  },
  beforeRouterLeave (to, from, next) {
    if (to.path === '/') {
      from.meta.keepAlive = true
    } else {
      from.meta.keepAlive = false
    }
    console.log('-------------------------')
    next()
  },
  beforeDestroy () {
  },
  routerback: function () {
    this.$router.back(-1)
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
   width:50%;
   margin:auto;
   text-align: left;
   /* text-indent: 2em; */
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

.cover-img-style {
  /* width: 700px; */
  /* height: 400px; */
  width: 100%;
  height: 100%;
  margin: auto;
  max-height:650px;
  max-width: 1000px;
  vertical-align:middle;
}
.el-container-style {
  display: inline-block;
  margin: 62px;
}

.bg-color {
  background: #fcffff;
}
.bg-size {
  height: 100%;
  /* width:100%; */
  margin: 5px 5px 5px 5px;
}
.el-row-img-size {
  /* height: 190px; */
  /* width: 200px; */
  position: relative;
  display:block;
  /* width: 100%; */
  height: 100%;
  margin: 10px 10px 10px 10px;
  /* max-height:352px; */
  max-height:450px;
  /* max-width: ; */
  max-width: 352px;
  /* vertical-align: middle */
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

.step-div{
  margin-top: 10px;
}

.tip-text{
  margin: auto;
  width: 70%;
}

</style>

<style>

</style>

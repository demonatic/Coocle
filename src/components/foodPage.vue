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
        <span>搜索</span>
      </div>
    </header>

    <el-container class="el-container-style">
      <el-image :src="cover" class="cover-img-style img-radius"></el-image>
      <el-header class="el-header-title">{{title}}</el-header>

      <el-main>
        <div class="rate-numbers">
          <el-rate
            v-model="value"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          ></el-rate>
        </div>
        <div class="like-numbers">
          <i class="fa fa-heart" aria-hidden="true">
            <span>&nbsp;&nbsp;{{favorite}}</span>
          </i>
        </div>
      </el-main>
      <el-main>
        <p>虾仁炒西兰花的营养成分高，而且十分全面，主要包括蛋白质、碳水化合物、脂肪、矿物质、维生素C和胡萝卜素等！</p>
      </el-main>
    </el-container>
    <el-container>
      <el-main class="list-main-style">
        <h2>{{title}}的用料</h2>
        <el-header></el-header>
        <el-table
          :data="tableData"
          style="width:600px"
          stripe
          class="el-table-margin el-table-font"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-table-column prop="material" label="用料" width="300"></el-table-column>
          <el-table-column prop="amount" label="用量" width="300"></el-table-column>
        </el-table>
      </el-main>
    </el-container>

    <el-container>
      <el-main>
        <h2>{{title}}的制作步骤</h2>
        <div class="mystep">
          <el-header></el-header>
          <el-row>
            <div class="line" v-for="(item,index) in urls" :key="item">
              <el-col :span="3" :offset="7">
                <div
                  class="grid-content bg-color bg-size box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"
                >
                  <!-- <img class = "el-row-img-size" src = "../assets/1.jpeg" /> -->
                  <el-image
                    class="el-row-img-size img-radius"
                    :src="item.url"
                    :fit="fit"
                    :preview-src-list="srcList"
                  >{{item.url}}</el-image>
                </div>
              </el-col>
              <el-col :span="8" :offset="0">
                <div class="grid-content bg-color bg-size to-left">
                  <strong class="strong-align">步骤{{index+1}}</strong>
                  <p class="left-align">{{item.step}}</p>
                </div>
              </el-col>
            </div>
          </el-row>
        </div>
        <!-- 食品用料列表 -->
      </el-main>
    </el-container>
    <el-container>
      <el-header>
        <h2>{{title}}的烹饪技巧</h2>
      </el-header>
      <el-main>
        <p>做菜好吃都有技巧，我的每道菜都有小妙招，大家搜索“豆果”可以直接查看我的菜谱！</p>
      </el-main>
    </el-container>
  </div>
  <!-- </el-container> -->
  <!-- </div>   -->
</template>

<script>
import imgCover from '../assets/cover.jpeg'
import img1 from '../assets/1.jpeg'
import img2 from '../assets/2.jpeg'
import img3 from '../assets/3.jpeg'
import img4 from '../assets/4.jpeg'
import img5 from '../assets/5.jpeg'
import img6 from '../assets/6.jpeg'
import img7 from '../assets/7.jpeg'
import img8 from '../assets/8.jpeg'
import img9 from '../assets/9.jpeg'
import img10 from '../assets/10.jpeg'
import img11 from '../assets/11.jpeg'
export default {
  name: 'HelloWorld',
  sites: [],
  books: [],
  props: {
    msg: String
  },
  data () {
    return {
      value: 5,
      favorite: 5000,
      cover: imgCover,
      title: '虾仁炒西兰花',
      urls: [
        { url: img1, step: '将鲜虾洗净，拨壳、去虾线' },
        {
          url: img2,
          step: '在拨好的虾仁中加入适量胡椒粉，料酒、味极鲜酱油腌制片刻'
        },
        { url: img3, step: '将西兰花、胡萝卜洗净，切块' },
        {
          url: img4,
          step:
            '准备一锅清水，放入切好的西兰花，加入适量盐，色拉油，开大火煮开（这样能使西兰花保持翠绿颜色)'
        },
        { url: img5, step: '煮至西兰花变色，捞出沥干水分；' },
        {
          url: img6,
          step: '热锅倒油，加入大蒜末，腌制好的虾仁，煸炒至金黄色；'
        },
        { url: img7, step: '加入切好的胡萝卜片翻炒一下；' },
        { url: img8, step: '加入焯熟的西兰花；' },
        { url: img9, step: '加入适量盐、糖，翻炒片刻即可出锅！' },
        { url: img10, step: '成品；' },
        { url: img11, step: '成品2' }
      ],
      srcList: [img1, img2, img3, img4],
      stepdecs: [
        { step: '将鲜虾洗净，拨壳、去虾线' },
        { step: '在拨好的虾仁中加入适量胡椒粉，料酒、味极鲜酱油腌制片刻' },
        { step: '将西兰花、胡萝卜洗净，切块' },
        {
          step:
            '准备一锅清水，放入切好的西兰花，加入适量盐，色拉油，开大火煮开（这样能使西兰花保持翠绿颜色)'
        }
      ],
      tableData: [
        {
          material: '西兰花',
          amount: '1颗'
        },
        {
          material: '胡萝卜',
          amount: '半个'
        },
        {
          material: '胡椒粉',
          amount: '适量'
        },
        {
          material: '盐',
          amount: '适量'
        },
        {
          material: '糖',
          amount: '一小勺'
        },
        {
          material: '鲜虾',
          amount: '150g'
        },
        {
          material: '料酒',
          amount: '适量'
        },
        {
          material: '味极鲜酱油',
          amount: '适量'
        },
        {
          material: '油',
          amount: '适量'
        },
        {
          material: '大蒜',
          amount: '2瓣'
        }
      ],
      tips:
        '做菜好吃都有技巧，我的每道菜都有小妙招，大家搜索“豆果”可以直接查看我的菜谱！'
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

.like-numbers {
  display: inline-block;
  margin-top: 5px;
  padding-left: 130px;
}
.like-numbers {
  color: #d8345f;
}
.rate-numbers {
  display: inline-block;
  margin-top: 5px;
  padding-right: 200px;
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
</style>

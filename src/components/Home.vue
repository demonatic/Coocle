<template>
    <div class="wrapper" overflow-y="scroll">
        <div class="background-img">
          <el-button v-if='header_show_flag' class="go-top" @click="scroll_to_top" circle>
            <i class="fa fa-angle-up"></i>
          </el-button>
          <div v-bind:class="header_show_flag?'fixed-search':'float-search'">
            <header class="top-header" v-if='header_show_flag'>
              <div class="header-menu" id="find-menu">
                <i class="fa fa-th"></i>
                <span>发现</span>
              </div>
              <div class="header-menu" id="search-menu">
                <i class="fa fa-dot-circle-o"></i>
                <span>搜索</span>
              </div>
            </header>
            <div class="search-input">
              <i class="fa fa-search" @click="search()"></i>
              <input type="text" maxlength="46" v-model="keyword" placeholder="Search recipes"
                @keyup="get_suggestion($event)" @keydown.enter="search()" @keydown.down="suggestion_down()" @keydown.up.prevent="suggestion_up()"
                @focus="show_suggestion()" @blur="hide_suggestion()"
              >
              <span class="search-clear" @click="clear_input()">&times;</span>
              <div class="search-select" v-if="suggestion_show_flag">
                <transition-group name="itemfade" tag="ul" mode="out-in" v-cloak>
                  <li v-for="(value,index) in suggest_items" :class="{selectback:index==current_index}" class="search-select-option search-select-list"
                    @mouseover="suggestion_hover(index)" @click="suggestion_click(index)" :key="value">
                    {{value}}
                  </li>
                </transition-group>
              </div>
            </div>
            <div class="search-description">
              <span>食谱／食材 &emsp;&emsp;&emsp;&emsp;中餐／西餐／面食／甜点／饮料</span>
            </div>
            <div class="navigator">
              <span>为你推荐</span>
              <i class="fa fa-angle-double-down"></i>
            </div>
          </div>
        </div> <!-- background-image -->
        <div class="main-content">
          <el-tabs class="content-tab" v-model="active_tab_ame" @tab-click="handle_tab_click"
          tab-position="top">
            <el-tab-pane label="综合最佳" name="first">综合最佳</el-tab-pane>
            <el-tab-pane label="收藏最多" name="second">收藏最多</el-tab-pane>
            <el-tab-pane label="做过最多" name="third">做过最多</el-tab-pane>
          </el-tabs>
         <grid-layout
            id="recipe-grid"
            :layout.sync="layout"
            :col-num="10"
            :is-draggable="true"
            :is-resizable="false"
            :is-mirrored="false"
            :vertical-compact="false"
            :margin="[10, 0]"
            :use-css-transforms="true"
            :preventCollision="true"
            :responsive="true"
          >
            <grid-item v-for="item in layout" :key="item.i"
              :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i"
            >
              <el-container class="recipe-item">
                <el-main>
                  <div class="effect-box">
                    <el-image class="recipe-cover" :src="item.info.cover_img"></el-image>
                    <div class="border-line2">
                        <p>{{item.info.ingredient_str}}</p>
                    </div>
                  </div>
                </el-main>
                <el-header>
                  <span class="recipe-title">{{item.info.recipe_name}}</span>
                </el-header>
                <el-footer class="recipe-ranks">
                  <div class="recipe-like">
                    <i class="fa fa-heart" aria-hidden="true"></i>
                    <span style="padding-left:5px">{{item.info.favourite}}</span>
                  </div>
                  <div class="recipe-rate">
                    <el-rate v-model="item.info.rate" disabled show-score score-template="{value}"
                    text-color=#293F4F :colors="['#F4E04D','#F4E04D','#F4E04D']" disabled-void-color='#DCDCDC'>
                    </el-rate>
                  </div>
                </el-footer>
              </el-container>
              <!-- {{item.i}} -->
            </grid-item>
          </grid-layout>
        </div> <!-- main-content -->
    </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
var recipeLayout = [
  // {'x': 0, 'y': 0, 'w': 2, 'h': 2, 'i': '0'},
  // {'x': 2, 'y': 0, 'w': 2, 'h': 2, 'i': '1'},
  // {'x': 4, 'y': 0, 'w': 2, 'h': 2, 'i': '2'},
  // {'x': 6, 'y': 0, 'w': 2, 'h': 2, 'i': '3'},
  // {'x': 0, 'y': 2, 'w': 2, 'h': 2, 'i': '4'},
  // {'x': 2, 'y': 2, 'w': 2, 'h': 2, 'i': '5'},
  // {'x': 4, 'y': 2, 'w': 2, 'h': 2, 'i': '6'},
  // {'x': 6, 'y': 2, 'w': 2, 'h': 2, 'i': '7'},
  // {'x': 0, 'y': 4, 'w': 2, 'h': 2, 'i': '8'}
]

export default {
  name: 'Home',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  data () {
    return {
      keyword: '',
      suggest_items: [],
      current_index: -1,
      suggestion_show_flag: true,
      header_show_flag: false,
      scroll_top: null,
      loading: false,
      active_tab_ame: 'first',
      layout: []
    }
  },
  mounted () {
    window.addEventListener('scroll', () => {
      // document.documentElement.scrollTop += 2
      this.scroll_top = document.documentElement.scrollTop ||
                        window.pageYOffset ||
                        document.body.scrollTop
      if (window.pageYOffset > 100) {
        this.header_show_flag = true
      } else {
        this.header_show_flag = false
      }
    }, true)
  },
  http: {
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  },
  methods: {
    handle_tab_click (tab, event) {
      console.log(tab, event)
    },
    scroll_to_top () {
      let $this = this
      // 返回顶部动画特效
      setTimeout(function animation () {
        setTimeout(() => {
          if ($this.scroll_top > 0) {
            var speed = $this.scroll_top / 25 // 步进速度
            $this.scroll_top -= (speed < 1.2 ? 1.2 : speed)

            // 返回顶部
            if (document.documentElement.scrollTop > 0) {
              document.documentElement.scrollTop = $this.scroll_top
            } else if (window.pageYOffset > 0) {
              window.pageYOffset = $this.scroll_top
            }
            animation()
          }
        }, 3)
      }, 3)
    },
    search_scroll: function (event) {
      if (window.scrollY > 50) {
        this.header_show_flag = true
      } else {
        this.header_show_flag = false
      }
    },
    get_suggestion: function (event) {
      if (event.keyCode === 38 || event.keyCode === 40) { // ignore arrow up or down
        return
      }
      console.log('call auto suggest')
      this.$http.jsonp('https://sug.so.360.cn/suggest?word=' + this.keyword + '&encodein=utf-8&encodeout=utf-8').then(function (res) {
        // console.log(res.data.s)
        this.suggest_items = res.data.s
      })
    },
    search: function () {
      var searchContent = `{"query": "${this.keyword}","query by": ["recipe_name","context"]}`
      console.log(searchContent)
      this.$http.post('http://localhost:8888/collections/recipe/documents-search', searchContent).then(function (res) {
        recipeLayout = []
        let hits = res.body.hits
        for (let i = 0; i < hits.length; i++) {
          let hit = hits[i]
          let ingredientStr = ''
          for (let j = 0; j < hit.ingredients.length; j++) {
            if (ingredientStr.length !== 0) {
              ingredientStr += ', '
            }
            ingredientStr += hit.ingredients[j].title
          }
          hit['ingredient_str'] = ingredientStr
        }
        let index
        for (index in hits) {
          console.log(hits[index])
          let len = recipeLayout.length
          recipeLayout.push({
            'x': 2 * (len % 4),
            'y': 2 * (len / 4),
            'w': 2,
            'h': 2,
            'i': recipeLayout.length,
            'info': hits[index]
          })
        }
        this.layout = recipeLayout
      })
    },
    clear_input: function () {
      this.keyword = ''
      this.suggest_items = []
    },
    suggestion_hover: function (index) {
      this.current_index = index
    },
    suggestion_click: function (index) {
      this.keyword = this.suggest_items[index]
      this.search()
    },
    suggestion_up: function () {
      this.current_index--
      if (this.current_index === -1) {
        this.current_index = this.suggest_items.length - 1
      }
      this.keyword = this.suggest_items[this.current_index]
    },
    suggestion_down: function () {
      this.current_index++
      if (this.current_index === this.suggest_items.length) {
        this.current_index = 0
      }
      this.keyword = this.suggest_items[this.current_index]
    },
    hide_suggestion: function () {
      setTimeout(() => {
        this.suggestion_show_flag = false
      }, 200)
    },
    show_suggestion: function () {
      this.suggestion_show_flag = true
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.background-img{
  width: 100%;
  height: 730px;
  position: absolute;
  background: url('../assets/bg3.jpg') top no-repeat;
}

.background-img:after{
  position: absolute;
  background-color: rgb(74, 75, 57);
  opacity: 0.3;
  top: 0;
  left: 0;
  content: "";
  width: 100%;
  height: 100%;
  height: 730px;
  z-index: 1;
}

.top-header{
  position: fixed;
  top:0;
  width: 100%;
  height: 62px;
  z-index: 999;
  box-shadow: 0 2px 6px rgba(10, 10, 10, 0.3);
  background: #fafafa;
}

.header-menu{
  position: fixed;
  margin-top: 21px;
  font-size: large;
  cursor: pointer;
}

#find-menu{
  left: 21%;
}

#search-menu{
  left: 27%;
}

.top-header .search-input{
  background: white
}

.float-search .search-input {
  height: 45px;
  width: 600px;
  left: 0;
  right: 0;
  margin: 0 auto;
  margin-top: 120px;
  position: absolute;
  display: flex;
  z-index: 999;
}

.fixed-search .search-input{
  position: fixed;
  height: 45px;
  width: 600px;
  left: 0;
  right: 0;
  margin: 0 auto;
  top:8px;
  display: flex;
  z-index: 999;
}

.fixed-search .search-input input{
  width: 800px;
  background: rgb(253, 253, 253);
  border: 2px solid #e2e1e1;
  box-shadow: 0 4px 10px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.05) inset;
}

.search-input input{
  text-indent: 32px;
  border: 1px solid #e4e4e4;
  border-radius: 39px;
  box-sizing: border-box;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5), 0 0 2px rgba(0,0,0,0.05) inset;
  width: 500px;
  height: 45px;
  outline:none;
  font-size: 18px;
  font-weight:lighter;
  font-family: "europa-regularregular, sans-serif", "Microsoft YaHei";
  float: left;
  padding-left: 10px;
  padding-right: 10px;
  overflow: auto;
  transition: width 0.5s;
}

.search-input input:focus{
  border: 1px;
  border-color: white;
}

.search-input i{
  position: absolute;
  display: block;
  width: 30px;
  height: 30px;
  left: 11px;
  top: 15px;
  cursor: pointer;
  color: rgb(98, 97, 97);
  transform: rotateY(180deg);
  z-index: 1;
}

.search-input i:hover{
  filter: drop-shadow(1px 1px 1px rgb(182, 182, 182));
}

.search-clear {
  width: 21px;
  height: 21px;
  position: relative;
  display: block;
  line-height: 21px;
  text-align: center;
  cursor: pointer;
  font-size: 20px;
  margin-left: -30px;
  top: 12px
}

.search-select {
  position: absolute;
  top: 45px;
  width: 500px;
  top: 55px;
  left: -20px;
  box-sizing: border-box;
  z-index: 999;
}

.search-select li{
  border: 1px solid #d4d4d4;
  border-top: none;
  border-bottom: none;
  background-color: #fff;
  width: 100%;
  list-style: none;
}

.search-select li:hover{
  color: rgb(61, 155, 116);
}

.search-select ul{
  margin:0;
  text-align: left;
  filter: drop-shadow(1px 1px 1px rgb(216, 215, 215))
}

.search-select-list {
  transition: all 0.4s
}

.search-select-option {
  box-sizing: border-box;
  padding: 7px 10px;
}

.selectback{
  background-color: #eee !important;
  cursor: pointer;
}

.itemfade-enter,
.itemfade-leave-active {
    opacity: 0;
}
.itemfade-leave-active {
    position: absolute;
}

.search-description{
  position: absolute;
  left:0; right:0;
  margin-left: -120px;
  color: white;
  margin-top:180px;
  z-index: 10;
}

.navigator{
  position: absolute;
  left:0; right:0;
  margin-left: -120px;
  color: white;
  margin-top:600px;
  z-index: 10;
}

.navigator i{
  margin-top: 10px;
  font-size: 40px;
  display:block;
}

.navigator span{
  font-size: x-large;
}

.main-content{
  position: absolute;
  margin-top: 730px;
  box-shadow: 0 0px 15px rgba(10, 10, 10);
  background-color: #F5F5F5;
  width: 100%;
  overflow-x: auto;   /*main content overflow */
}

.content-tab{
  font-size: 0px;
  margin-left: 100px;
  margin-top: 40px;
  width: 360px;
}

#recipe-grid{
  position: relative;
  width: 100%;
  margin-left: 12%;
  overflow: hidden;
}

.recipe-item{
  width: 300px;
  background-color: white;
  border-radius: 6px;
  margin-bottom: 30px;
  box-shadow: 0 2px 6px rgba(10, 10, 10, 0.1);
}

.recipe-ranks{
  border-top: solid 1px rgb(158, 158, 158,0.2);
}

.recipe-like{
  display: inline-block;
  margin-top: 5px;
  padding-right: 30px;
}

.recipe-like i{
  color:#D8345F;
}

.recipe-rate{
  display: inline-block;
  margin-top: 5px;
  padding-left: 35px;
}

.recipe-cover{
  position: relative;
  display: block;
  width: 100%; height: 180px;
  border-radius: 5px;
  cursor:pointer;
}

.recipe-title{
  display: inline-block;
  color: #333333;
  font-weight: 500;
  font-size:large;
  text-align: left;
  line-height: 28px;
  width: 100%;
}

.wrapper{
  height: 100vh;
  overflow-x: hidden;
}

.go-top{
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 36px;
  height: 36px;
  z-index: 999;
  box-shadow: 0 0 6px rgba(0,0,0, .12);
}

.go-top i{
  font-size: x-large;
  margin-left: -3px;
  margin-top: -7px;
  color: #1989fa;
}

.main-footer{
  margin-left: -500px;
  color: #acacac;
}
</style>

<style>

.el-container{
  margin-bottom: 40px !important;
}

.el-col{
  width: 300px;
  margin-right: 40px;
}

.el-rate{
  display: inline-block;
}

.el-rate i{
  font-size: 21px;
}

.el-rate span{
  font-size:medium;
}

.main-content ul{
  list-style: none;
}

.content-tab *{
  color: #3b3b3b;
  font-size: large;
}

.el-main{
  padding:10px;
}

.el-header{
  height: 36px !important;
}

.el-footer{
  height: 30px !important;
  padding-left: 0px;
  padding-right: 0px;
}

.el-tabs__content{
  height: 0px;
}
.el-tabs__active-bar{
  background-color: #eb3c68;
  height: 3px;
}

.el-tabs__nav-wrap:after{
  background-color: #F5F5F5;
}

.el-tabs__item:hover{
  color: #ffd342;
}

.el-tabs__item.is-active{
  color: #333333;
}
.el-tabs__item{
  color: #acacac;
}

.effect-box {
  position: relative;
  display: inline-block;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  font-size: x-large;
  font-weight: 500;
}

.effect-box img {
  display: block;
  width: 100%;
  height: 100%;
  -webkit-transition: opacity .5s;
  transition: opacity .5s
}

.effect-box:hover img {
  opacity: .4
}

.effect-box .border-line2 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 2em;
  font-size: 1.25em;
  color: #fff;
  text-transform: uppercase;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden
}

.effect-box .border-line2::after,
.effect-box .border-line2::before {
  position: absolute;
  top: 30px;
  right: 30px;
  bottom: 30px;
  left: 30px;
  content: '';
  opacity: 0;
  pointer-events: none;
  -webkit-transition: opacity .35s, -webkit-transform .35s;
  transition: opacity .35s, transform .35s
}

.effect-box .border-line2::before {
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
  -webkit-transform: scale(0, 1);
  transform: scale(0, 1)
}

.effect-box .border-line2::after {
  border-right: 1px solid #fff;
  border-left: 1px solid #fff;
  -webkit-transform: scale(1, 0);
  transform: scale(1, 0)
}

.effect-box:hover .border-line2::after,
.effect-box:hover .border-line2::before {
  opacity: 1;
  -webkit-transform: scale(1);
  transform: scale(1)
}

.effect-box .border-line2 p {
  padding: 4px 10px;
  margin: 0;
  font-size: 16px;
  line-height: 1.0;
  text-align: center;
  color: #fff;
  letter-spacing: 1px;
  opacity: 0;
  -webkit-transition: opacity .35s, -webkit-transform .35s;
  transition: opacity .35s, transform .35s;
  -webkit-transform: translate3d(0, 20px, 0);
  transform: translate3d(0, 20px, 0)
}

.effect-box:hover .border-line2 p {
  opacity: 1;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0)
}

.header-menu::after{
  position: absolute;
  bottom: -17px;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #00aeff;
  content: '';
  -webkit-transform: scaleX(0);
  transform: scaleX(0);
  -webkit-transition: ease-in-out 0.2s;
  transition: ease-in-out 0.2s;
}

.header-menu:hover::after {
  -webkit-transform: scaleX(1);
  transform: scaleX(1);
}
</style>

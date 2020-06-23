<template>
    <div class="wrapper" overflow-y="scroll">
        <div class="background-img">
          <el-button v-if='header_show_flag' class="go-top" @click="scroll_to_top" circle>
            <i class="fa fa-angle-up"></i>
          </el-button>
          <div v-bind:class="header_show_flag?'fixed-search':'float-search'">
            <header class="top-header" v-if='header_show_flag'>
              <div class="header-menu" id="find-menu" @click="do_recommendation()">
                <i class="fa fa-th"></i>
                <span>发现</span>
                <transition name='underline-fade'>
                  <div v-if='find_search_toggle' class='underline'></div>
                </transition>
              </div>
              <div class="header-menu" id="search-menu" @click="do_search()">
                <i class="fa fa-dot-circle-o"></i>
                <span>搜索</span>
                <transition name='underline-fade'>
                  <div v-if='!find_search_toggle' class='underline'></div>
                </transition>
              </div>
            </header>
            <div class="search-input">
              <i class="fa fa-search" @click="do_search()"></i>
              <input type="text" maxlength="46" v-model="keyword" placeholder="Search recipes"
                @keyup="get_suggestion($event)" @keydown.enter="do_search()" @keydown.down="suggestion_down()" @keydown.up.prevent="suggestion_up()"
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
            <div class="navigator" @click="scroll_to_search_result()">
              <span v-if="find_search_toggle">为你推荐</span>
              <span v-if="!find_search_toggle">'{{keyword}}' &nbsp;的搜索结果</span>
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
            :col-num="12"
            :is-draggable="false"
            :is-resizable="false"
            :is-mirrored="false"
            :vertical-compact="true"
            :use-css-transforms="false"
            :preventCollision="true"
            :responsive="true"
          >
            <grid-item v-for="item in layout" :key="item.i"
              :x.sync="item.x" :y.sync="item.y" :w.sync="item.w" :h.sync="item.h" :i="item.i"
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
                <!-- <span class = "recipe-title">{{item.info.recipe_name}}</span> -->
                 <!-- <span class="recipe-title" @click="itemClick">{{item.info.recipe_name}}</span> -->
                <span class = "recipe-title">
                  <router-link :to="{path:'./foodPage',query:{id:item.info}}">
                            <el-link href="https://element.eleme.io" target="_blank" style="font-size:17px;">{{item.info.recipe_name}}</el-link>
                            </router-link></span>
                </el-header>
                <el-footer class="recipe-ranks">
                  <div class="recipe-like">
                    <i class="fa fa-heart"></i>
                    <span style="padding-left:5px">{{item.info.favourite}}</span>
                  </div>
                  <div class="recipe-rate">
                    <el-rate v-model="item.info.rate" disabled show-score score-template="{value}"
                    text-color=#293F4F :colors="['#F4E04D','#F4E04D','#F4E04D']" disabled-void-color='#DCDCDC'>
                    </el-rate>
                  </div>
                </el-footer>
              </el-container>
            </grid-item>
          </grid-layout>
        </div> <!-- main-content -->
    </div>
</template>

<script>
// import foodPage from './foodPage'
import VueGridLayout from 'vue-grid-layout'
var recipeLayout = []

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
      active_tab_ame: 'first',
      layout: recipeLayout,
      find_search_toggle: true
    }
  },
  mounted () {
    window.addEventListener('scroll', () => {
      this.scroll_top = document.documentElement.scrollTop ||
                        window.pageYOffset ||
                        document.body.scrollTop
      if (window.pageYOffset > 110) {
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
    scroll_to_search_result () {
      let $this = this
      // 返回顶部动画特效
      setTimeout(function animation () {
        setTimeout(() => {
          let targetY = 680
          if ($this.scroll_top < targetY) {
            let speed = (targetY - $this.scroll_top) / 7 // 步进速度
            $this.scroll_top += (speed < 2.8 ? 2.8 : speed)
            // 返回顶部
            if (document.documentElement.scrollTop >= 0) {
              document.documentElement.scrollTop = $this.scroll_top
            } else if (window.pageYOffset >= 0) {
              window.pageYOffset = $this.scroll_top
            }
            animation()
          }
        }, 3)
      }, 3)
    },
    get_suggestion: function (event) {
      if (event.keyCode === 38 || event.keyCode === 40) { // ignore arrow up or down
        return
      }
      console.log('call auto suggest')
      let uriEncoded = encodeURI('http://47.98.241.147:7777/collections/recipe/auto_suggestion?q=' + this.keyword)
      this.$http.get(uriEncoded).then(function (res) {
        console.log(res.body.suggestions)
        this.suggest_items = res.body.suggestions
      })
    },
    do_search: function () {
      var searchContent = `{"query": "${this.keyword}","query by": ["recipe_name","context"]}`
      console.log(searchContent)
      this.$http.post('http://47.98.241.147:7777/collections/recipe/documents', searchContent).then(function (res) {
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
            if (ingredientStr.length > 36) {
              ingredientStr += '...'
              break
            }
          }
          hit['ingredient_str'] = ingredientStr
        }
        let index
        for (index in hits) {
          let len = recipeLayout.length
          console.log('x', 2 * (len % 4), 'y', 2 * (len / 4))
          recipeLayout.push({
            'x': 2 * (len % 4) + 0.4 * (len % 4),
            'y': 2 * parseInt(len / 4),
            'w': 2,
            'h': 2,
            'i': recipeLayout.length,
            'info': hits[index]
          })
        }
        this.find_search_toggle = false
        this.layout = recipeLayout
        console.log(this.layout)
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
      this.do_search()
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
    },
    do_recommendation: function () {
      this.find_search_toggle = true
    }
    // itemClick:function() {
    //    this.$router.push('/foodPage');
    //    console.log(this.info)
    // }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.background-img{
  width: 100%;
  height: 730px;
  position: relative;
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
  margin-top: 22px;
  font-size: large;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
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
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
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
  position: relative;
  box-shadow: 0 0px 15px rgba(10, 10, 10);
  background-color: #F5F5F5;
  width: 100%;
  height: 100%;
  overflow-x: hidden;   /*main content overflow */
  overflow-y: hidden;
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
  box-shadow: 0 2px 6px rgba(10, 10, 10, 0.15);
}

.recipe-ranks{
  border-top: solid 1px rgb(158, 158, 158,0.2);
}

.recipe-like{
  position: relative;
  float: left;
  margin-top: 5px;
  margin-left: 18px;
}

.recipe-like i{
  color:#D8345F;
}

.recipe-rate{
  float: right;
  margin-top: 5px;
  margin-right: 15px;
}

.recipe-cover{
  position: relative;
  display: block;
  width: 280px; height: 180px;
  border-radius: 5px;
  cursor:pointer;
}

.recipe-title{
  display: inline-block;
  color: #333333;
  padding-bottom: 5px;
  font-weight: 500;
  font-size:large;
  text-align: left;
  line-height: 28px;
  width: 100%;
}

.wrapper{
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

.columns {
  /* -moz-columns: 120px;
  -webkit-columns: 120px; */
  columns: 300px;
}

.el-container{
  margin-bottom: 40px !important;
  margin: 0px !important;
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
  height: fit-content !important;
  height:-webkit-fit-content !important;
  height:-moz-fit-content !important;
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
  backface-visibility: hidden;
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

.header-menu .underline{
  position: absolute;
  bottom: -16px;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #00aeff;
}

.underline-fade-enter-active, .underline-fade-leave-active{
  -webkit-transition: ease-in-out .2s;
  transition: ease-in-out .2s;
}

.underline-fade-enter, .underline-fade-leave-to{
  transform: scaleX(0);
}

a {
    text-decoration: none;
    font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    line-height:1.5;
}

.router-link-active {
    text-decoration: none;
}
</style>

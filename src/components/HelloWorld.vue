<template>
    <div>
        <div class="background-img">
          <div v-bind:class="header_show_flag?'fixed-search':'float-search'">
            <header class="top-header" v-if='header_show_flag'>
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
          </div>
        </div> <!-- background-image -->
        <div class="main-content">
          <div id="magazine">
              <div class="recipe-page" v-for="(value,index) in pages" v-bind:key="index">
                <ul>
                  <li v-for="i in count" v-bind:key="i">
                    <el-row :gutter="20">
                      <el-col :xs="12" :lg="16" :xl="20">
                        <el-container>
                            <el-image class="recipe-cover" :src="url">
                            </el-image>
                            <el-container>
                              <el-header>
                                <span class="recipe-title">虾仁炒西兰花</span>
                              </el-header>
                              <hr class="recipe-title-split">
                              <el-rate class="recipe-rate" v-model="rate" disabled show-score score-template="{value}"
                                text-color=#B4181F :colors="['#FFA56D', '#FF9627','#FD873F']">
                              </el-rate>
                              <el-main class="recipe-ingredient">
                                西兰花, 鲜虾, 胡萝卜, 料酒,胡椒粉, 味极鲜酱油,盐, 油, 糖, 大蒜
                              </el-main>
                            </el-container>
                          </el-container>
                      </el-col>
                    </el-row>
                  </li>
                </ul>
              </div>
          </div> <!-- magazine -->
        </div> <!-- main-content -->
    </div>
</template>

<script>
import $ from 'jquery'
import 'turn.js'

export default {
  name: 'HelloWorld',
  data () {
    return {
      keyword: '',
      suggest_items: [],
      current_index: -1,
      suggestion_show_flag: true,
      header_show_flag: false,
      scroll_top: null,
      count: 4,
      loading: false,
      url: 'https://cp1.douguo.com/upload/caiku/6/e/8/400x266_6e0988f8d514a6ce5d01f7afb3681aa8.jpeg',
      rate: 3.7,
      pages: [1, 2, 3, 4, 5]
    }
  },
  computed: {
    noMore () {
      return this.count >= 4
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  mounted () {
    window.addEventListener('scroll', () => {
      console.log('scroll')
      // document.documentElement.scrollTop += 2
      this.scroll_top = document.documentElement.scrollTop ||
                        window.pageYOffset ||
                        document.body.scrollTop
      console.log(window.pageYOffset)
      if (window.pageYOffset > 50) {
        this.header_show_flag = true
      } else {
        this.header_show_flag = false
      }
    }, true)
  },
  methods: {
    load () {
      this.loading = true
      setTimeout(() => {
        this.count += 2
        this.loading = false
      }, 2000)
    },
    scrollToTop () {
      let $this = this
      // 返回顶部动画特效
      setTimeout(function animation () {
        setTimeout(() => {
          if ($this.scroll_top > 0) {
            // 步进速度
            $this.scroll_top -= 10

            // 返回顶部
            if (document.documentElement.scrollTop > 0) {
              document.documentElement.scrollTop = $this.scroll_top - 10
            } else if (window.pageYOffset > 0) {
              window.pageYOffset = $this.scroll_top - 10
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
      console.log('call search', this.keyword)
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
$(function () {
  $('#magazine').turn({gradients: true, acceleration: true})
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.background-img{
  width: 100%;
  height: 730px;
  position: relative;
  background: url('../assets/bg3.jpg') top no-repeat;
  background-size: auto;
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
  box-shadow: 0 4px 10px rgba(10, 10, 10, 0.3);
  background: #fafafa;
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
  transition: width 0.3s;
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

.main-content{
  position: relative;
  margin-top: 0px;
  box-shadow: 0 6px 12px rgba(10, 10, 10, 0.5);
  width: 100%;
  height: 1200px;
  background: url(../assets/content-bg.jpg) no-repeat;
}

#magazine{
  position: relative;
  width:1152px;
  height:880px;
}
#magazine .turn-page{
  background-color:#ccc;
  background-size:100% 100%;
}

.recipe-page{
  border: 5px solid #003f5e;
  background: url(../assets/book-bg.jpg);
}

.recipe-cover{
  border: 5px solid #003f5e;
  width: 600px; height: 155px;
  margin-top: 5px;
  margin-bottom: 30px;
}

.recipe-title-split{
  display: block;
  width: 90%;
  margin-left: 20px;
  margin-top: -10px;
  size:3px;
}

.recipe-title{
  display: inline-block;
  color: #013D5F;
  font-weight: 500;
  font-size:x-large;
  text-align: left;
  line-height: 60px;
}

.el-rate{
  font-weight: 700;
  margin-top: -3px;
  margin-bottom: -10px;
  margin-left: 12px;
}

.el-aside {
  background-color: white;
  color: #333;
  text-align: center;
}

.el-main {
  color: #013D5F;
  text-align: center;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>

<style>
.el-rate i{
  font-size: 22px !important;
}

.recipe-page ul{
  list-style: none;
}
</style>

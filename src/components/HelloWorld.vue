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
          <div class="infinite-list-wrapper" style="overflow:auto">
            <ul class="list" v-infinite-scroll="load" infinite-scroll-disabled="disabled">
              <li v-for="i in count" class="infinite-list-item" v-bind:key="i">
                <el-row :gutter="20">
                    <el-col :xs="12" :lg="8" :xl="6" v-for="i in col_count" v-bind:key="i">
                        <el-container class="recipe-item">
                          <el-main>
                            <el-image class="recipe-cover" :src="url"></el-image>
                          </el-main>
                          <el-header>
                            <span class="recipe-title">虾仁炒西兰花</span>
                          </el-header>
                          <el-footer class="recipe-ranks">
                            <div class="recipe-like">
                              <i class="fa fa-heart" aria-hidden="true"></i>
                              <span>45</span>
                            </div>
                            <div class="recipe-rate">
                              <el-rate v-model="rate" disabled show-score score-template="{value}"
                              text-color=#293F4F :colors="['#FFA56D', '#FF9627','#FD873F']" disabled-void-color='#DCDCDC'>
                              </el-rate>
                            </div>
                          </el-footer>
                          <!-- <el-main class="recipe-ingredient">
                            西兰花, 鲜虾, 胡萝卜, 料酒,胡椒粉, 味极鲜酱油,盐, 油, 糖, 大蒜
                          </el-main> -->
                        </el-container>
                    </el-col>
                  </el-row>
              </li>
            </ul>
            <p v-if="loading">加载中...</p>
            <p v-if="noMore">没有更多了</p>
          </div>
        </div> <!-- main-content -->
    </div>
</template>

<script>

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
      col_count: 4,
      loading: false,
      url: 'https://cp1.douguo.com/upload/caiku/6/e/8/400x266_6e0988f8d514a6ce5d01f7afb3681aa8.jpeg',
      rate: 3.7,
      active_tab_ame: 'first'
    }
  },
  computed: {
    noMore () {
      return this.count >= 20
    },
    disabled () {
      return this.loading || this.noMore
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
  methods: {
    load () {
      this.loading = true
      setTimeout(() => {
        this.count += 2
        this.loading = false
      }, 2000)
    },
    handle_tab_click (tab, event) {
      console.log(tab, event)
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
  overflow-x: hidden;
}

.content-tab{
  font-size: 0px;
  margin-left: 100px;
  margin-top: 40px;
  width: 360px;
}

.infinite-list-wrapper{
  position: relative;
  width: 100%;
  margin-left: 12%;
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
  color:#db466b;
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

.recipe-ingredient {
  color: #333333;
  text-align: left;
  font-weight: 500;
  font-size: large;
  width: 200px;
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
  overflow: hidden;
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
</style>

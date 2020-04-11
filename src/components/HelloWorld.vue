<template>
    <div>
        <div class="background-img">
          <div v-bind:class="header_show_flag?'fixed-search':'wrapper'">
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
          </div>
          <div class="main-content">
            <el-row :gutter="20">
              <el-col :span="6"><div class="grid-content bg-purple"></div>
                  <el-container>
                    <el-aside width="200px">Aside</el-aside>
                    <el-container>
                      <el-header>Header</el-header>
                      <el-main>Main</el-main>
                    </el-container>
                  </el-container>
              </el-col>
              <el-col :span="6"><div class="grid-content bg-purple"></div>
                <el-container>
                    <el-aside width="200px">Aside</el-aside>
                    <el-container>
                      <el-header>Header</el-header>
                      <el-main>Main</el-main>
                    </el-container>
                  </el-container>
              </el-col>
              <el-col :span="6"><div class="grid-content bg-purple"></div>
                <el-container>
                    <el-aside width="200px">Aside</el-aside>
                    <el-container>
                      <el-header>Header</el-header>
                      <el-main>Main</el-main>
                    </el-container>
                  </el-container>
              </el-col>
              <el-col :span="6"><div class="grid-content bg-purple"></div>
                <el-container>
                    <el-aside width="200px">Aside</el-aside>
                    <el-container>
                      <el-header>Header</el-header>
                      <el-main>Main</el-main>
                    </el-container>
                  </el-container>
              </el-col>
            </el-row>
          </div>　<!-- main-content -->
        </div> <!-- background-image -->
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
      scroll_top: null
    }
  },
  mounted () {
    window.addEventListener('scroll', () => {
      this.scroll_top = document.documentElement.scrollTop ||
                        window.pageYOffset ||
                        document.body.scrollTop
      console.log(window.pageYOffset)
      if (window.pageYOffset > 68) {
        this.header_show_flag = true
      } else {
        this.header_show_flag = false
      }
    }, true)
  },
  methods: {
    scrollToTop () {
      let $this = this
      // 返回顶部动画特效
      setTimeout(function animation () {
        console.log('animation')
        console.log('>0')
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
      console.log('scroll')
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

.top-header{
  position: fixed;
  top:0;
  width: 100%;
  height: 60px;
  z-index: 999;
  box-shadow: 0 4px 10px rgba(10, 10, 10, 0.3);
  background: #fafafa;
}

.top-header .search-input{
  background: white
}

.background-img{
  width: 100%;
  height: 1200px;
  position: relative;
  background: url('../assets/bg1.jpg') top no-repeat;
  background-size: auto;
}

.wrapper .search-input {
  height: 45px;
  width: 600px;
  left: 0;
  right: 0;
  margin: 0 auto;
  margin-top: 80px;
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
}

.search-input input{
  text-indent: 32px;
  border: 1px solid #e4e4e4;
  border-radius: 39px;
  box-sizing: border-box;
  box-shadow: 0 4px 10px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.05) inset;
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
  top: 50px;
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
  filter: drop-shadow(5px 5px 5px rgb(216, 215, 215))
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

.main-content{
  position: absolute;
  margin-top: 250px;
}

.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
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

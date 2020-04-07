<template>
    <div>
        <!-- 组件不能写到template的根节点上，即每个组件只有一个根节点，这里的div就是这个template的根节点 -->
        <div class="search-input" >
          <i class="fa fa-search" @click="search()"></i>
          <input type="text" v-model="keyword" placeholder="Search recipes"
          @keyup="get_suggestion($event)" @keydown.enter="search()">
          <span class="search-clear" @click="clear_input()">&times;</span>
        </div>
    </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      keyword: ''
    }
  },
  methods: {
    get_suggestion: function (event) {
      if (event.keyCode === 38 || event.keyCode === 40) { // ignore arrow up or down
        return
      }
      console.log('call auto suggest')
    },
    search: function () {
      console.log('call search', this.keyword)
    },
    clear_input: function () {
      this.keyword = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search-input {
  height: 45px;
  width: 600px;
  margin: 0 auto;
  margin-top: 10px;
  position: relative;
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
  font-family: "europa-regularregular, sans-serif";
  float: left;
  padding-left: 10px;
  padding-right: 10px;
  overflow: clip;
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
  top: 14px;
}

.search-clear {
  width: 21px;
  height: 21px;
  position: absolute;
  display: block;
  line-height: 21px;
  text-align: center;
  cursor: pointer;
  font-size: 20px;
  right: 110px;
  top: 12px
}
</style>

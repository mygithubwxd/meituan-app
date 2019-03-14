<template>

  <div class="goods">
    <!-- 左侧分类列表 -->
      <!-- 设置ref属性 -->
    <div class="menu-wrapper" ref="menuScroll">
      <ul>
        <!-- 分类列表专场部分 -->
            <!-- v-bind添加class，判断当前右边的商品列表的滚动的高度，在商品高度数组（数组中的元素从0开始）中对应的索引值，
            来决定给哪个具体的分类（索引值）添加活动样式，实现联动的效果-->
            <!-- 给每一个分类li绑定点击事件，将当前li的索引值传给事件处理函数 -->
        <li class="menu-item" :class="{'current':currentIndex === 0}" @click="selectMenu(0)">
          <p class="text">
            <!-- v-if判断一下是否有图标，如果有才获取图标进行展示 -->
            <img class="icon" :src="container.tag_icon" v-if="container.tag_icon">
            {{container.tag_name}}
          </p>
        </li>

        <!-- 分类列表其他部分 -->
        <!-- v-for根据数据源重复渲染 -->
        <li class="menu-item" :class="{'current':currentIndex === index + 1}" v-for="(item,index) in goods" :key="index" @click="selectMenu(index+1)">
          <p class="text">
            <!-- v-if判断一下是否有图标，如果有才获取图标进行展示 -->
            <img class="icon" :src="item.icon" v-if="item.icon">
            {{item.name}}
          </p>
          <!-- 选择商品数量的小红点 -->
          <i class="num" v-show="calculateCount(item.spus)">
            <!-- calculateCount()方法返回该类商品选择的数量 -->
            {{calculateCount(item.spus)}}
          </i>
        </li>
      </ul>
    </div>

    <!-- 右侧商品列表 -->
      <!-- 设置ref属性 -->
    <div class="foods-wrapper" ref="foodScroll">
      <ul>
        <!-- 专场部分的两张大图 -->
            <!-- 为所有的li添加同一的类名food-list-hook -->
        <li class="container-list food-list-hook">
          <div v-for="(item,index) in container.operation_source_list" :key="index">
            <img :src="item.pic_url">
          </div>
        </li>
        <!-- 其他具体分类 -->
        <!-- v-for根据数据源进行重复渲染元素 -->
        <li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
          <h3 class="title">{{item.name}}</h3>
          <!-- 展示每个分类具体的商品列表 -->
          <ul>
            <!-- v-for根据数据源进行重复渲染元素 -->
            <!-- 点击商品，展示商品的详情页 -->
            <li v-for="(food,index) in item.spus" :key="index" @click="showDetail(food)" class="food-item">
              <!-- 计算属性是不能够接收参数的，这里需要使用方法 -->
              <div class="icon" :style="head_bg(food.picture)"></div>
              <div class="content">
                <h3 class="name">{{food.name}}</h3>
                <!-- 数据有的有，有的没有，需要做一个判断，如果有才展示 -->
                <p class="desc" v-if="food.description">{{food.description}}</p>
                <div class="extra">
                  <span class="saled">{{food.month_saled_content}}</span>
                  <span class="praise">{{food.praise_content}}</span>
                </div>
                <img class="product" :src="food.product_label_picture" alt="">
                <p class="price">
                  <span class="text">${{food.min_price}}</span>
                  <span class="unit">/{{food.unit}}</span>
                </p>
              </div>

              <!-- 购物车加减号 -->
              <div class="cartcontrol-wrapper">
                <!-- 使用引入的控制加减号的组件，并传参 -->
                <app-cart-control :food="food"></app-cart-control>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- 购物车 -->
    <!-- 父组件给子组件传值 props属性传值 -->
    <app-shopcart :poiInfo="poiInfo" :selectFoods="selectFoods"></app-shopcart>

    <!-- 商品详情页面 -->
    <!-- 父组件给子组件传值 props属性传值 -->
    <app-product-detail :food="selectFood" ref="foodView"></app-product-detail>

  </div>
</template>

<script>

// 引入better-scroll滚动插件
import BScroll from 'better-scroll'
import Shopcart from '../shopcart/Shopcart'
import CartControl from '../cartcontrol/CartControl'
import ProductDetail from '../productDetail/ProductDetail'

export default {
  data(){
    return {
      container:{},
      goods:[],
      poiInfo:{},
      listHeight:[],    //用来存储累加的高度
      menuScroll:{},    //BScroll的一个实例
      foodScroll:{},    //BScroll的一个实例
      scrollY:0,        //右侧商品列表y轴滚动的距离
      selectFood:{}    //点击的商品
    }
  },
  computed:{
    //处理一下右侧商品列表滚动时的高度，得到对应数组中元素的索引值
    currentIndex(){
      for(let i = 0; i < this.listHeight.length; i++){

        // 获取商品区间的范围
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i+1]

        // 判断滑动的高度是否在上述区间中
        // !height2数组越界
        if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
          // console.log(i)
          return i;  //返回在区间中的索引值
        }
      }
      return 0   //都没找到，则返回0
    },
    //计算属性中监听myfoods.spus中food.count（CartControl中向数据food中添加的响应式属性）是否发生变化
    //将所有点击加号添加到购物车的food信息 添加到数组中
    selectFoods(){
      let foods = []
      this.goods.forEach((myfoods) => {
        myfoods.spus.forEach((food) => {
          if(food.count > 0){
            foods.push(food)
          }
        })
      })
      return foods  //返回一个拥有属性count>0的food的集合的数组foods
    }
  },

  // 计算属性是不能够接收参数的，使用方法可以
  methods:{

    head_bg(imgName){
      return "background-image: url(" + imgName + ");"
    },
    //vm.$refs的值是一个对象，持有已注册过ref属性的所有HTML元素或者子组件，因为子组件在使用时也是作为标签（HTML元素）在父组件的内部使用的。
    //我们可以使用该方式来获取并操作DOM元素
    //使用引入的滑动插件
    //在钩子函数created中触发该方法
    initScroll(){
      this.menuScroll = new BScroll(this.$refs.menuScroll,{
        click:true  //激活可点击
      })
      this.foodScroll = new BScroll(this.$refs.foodScroll,{
        probeType:3,  //选项probeType   在屏幕滑动过程中实时的派发scroll事件
        click:true   //激活可点击
      })

      // BScroll实例方法
      // foodScroll   监听scroll事件
      this.foodScroll.on("scroll",(pos) => {
        // 获取滚动的实时坐标（x,y)
        // console.log(pos.y)
        this.scrollY = Math.abs(Math.round(pos.y))
        // console.log(this.scrollY)
        // 获取滚动时的y轴坐标，并存储到data中
      })
    },

    //计算右边商品列表的区间高度
    calculateHeight(){
      // 获取所有拥有food-list-hook类名的元素
      let foodlist = this.$refs.foodScroll.getElementsByClassName("food-list-hook")
      // console.log(foodlist)

      let height = 0
      this.listHeight.push(height)   //先将高度值0放入数组中

      for(let i = 0; i < foodlist.length; i++){
        let item = foodlist[i]
        // 每次循环，高度累加
        height += item.clientHeight
        // 每累加一次高度，就把当前累加的高度的值放入数组listHeight
        this.listHeight.push(height) 
      }
      // console.log(this.listHeight)
    },

    //点击左边的列表选项li,跳转到右边对应的商品列表
    selectMenu(index){
      // console.log(index)
      let foodlist = this.$refs.foodScroll.getElementsByClassName("food-list-hook")
      // 根据传过来的索引值获取对应的某个li
      let element = foodlist[index]
      // 滚动到对应元素的位置
      this.foodScroll.scrollToElement(element,250)
    },

    //返回count的值
    calculateCount(spus){
      let count = 0
      spus.forEach((food) => {
        if(food.count > 0){
          count += food.count
        }
      })
      return count
    },
    //点击事件，存储数据，展示详情页面
    showDetail(food){
      this.selectFood = food
      //父组件调用子组件中定义的方法
      this.$refs.foodView.showView()
    }
  },

  //钩子函数
  //发送网络请求，获取数据
  created(){
    fetch("/api/goods")
      .then(res => {
        return res.json()
      })
      .then(response =>{
        if(response.code == 0){
          this.container = response.data.container_operation_source
          this.goods = response.data.food_spu_tags
          this.poiInfo = response.data.poi_info

          //钩子函数created 此时DOM还没有渲染完
          //this.$nextTick()该实例方法可以确保在DOM更新完之后再立即自动执行回调函数，
          //一般在修改data数据之后使用该方法，以便获取更新后的DOM。
          this.$nextTick(() => {
            // 执行滚动方法
            this.initScroll()
            // 左侧分类列表与右侧右侧商品列表进行联动
            // 计算分类的区间高度
            this.calculateHeight()
            // 监听滚动的位置
            // 根据滚动位置确认下标,与左侧分类列表对应
            // 通过下标实现点击左侧,滚动右侧商品列表
          })
        }
      })
  },
  // 注册引入的组件（相当于自定义标签）
  components:{
    "app-shopcart":Shopcart,
    "app-cart-control":CartControl,
    "app-product-detail":ProductDetail
  }
}
</script>

<style scoped>
.goods{
  display: flex;
  position: absolute;
  top: 190px;
  bottom: 51px;
  overflow: hidden;
  width: 100%;
}

.goods .menu-wrapper{
  flex:0 0 85px;  /*不分配 不收缩 固定宽度*/
  background: #f4f4f4;
}

.goods .foods-wrapper{
  flex:1;
  /* background: blue; */
}

/* Menu item */ 
.goods .menu-wrapper .menu-item{
	padding: 16px 23px 15px 10px;
	border-bottom: 1px solid #E4E4E4;
  position: relative;
}

.goods .menu-wrapper .menu-item .text{
	font-size: 13px;
	color: #333333;
	line-height: 17px;
  vertical-align: middle;
  /* webkit内核浏览器 */
	-webkit-line-clamp: 2;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.goods .menu-wrapper .menu-item .text .icon{
	width: 15px;
	height: 15px;
	vertical-align: middle;
}

/* 专场样式 */ 
.goods .foods-wrapper .container-list{
	padding: 11px 11px 0 11px;
	border-bottom: 1px solid #E4E4E4;
}

.goods .foods-wrapper .container-list img{
	width: 100%;
	margin-bottom: 11px;
	border-radius: 5px;
}

/* 具体分类商品布局 */ 
.goods .foods-wrapper .food-list{
	padding: 11px;
}



.goods .foods-wrapper .food-list .title{
	height: 13px;
	font-size: 13px;
	background: url(./img/btn_yellow_highlighted@2x.png) no-repeat left center;
	background-size: 2px 10px;
	padding-left: 7px;
	margin-bottom: 12px;
}




.goods .foods-wrapper .food-list .food-item{
	display: flex;
	margin-bottom: 25px;
  position: relative;
}

.goods .foods-wrapper .food-list .food-item  .icon{
	flex: 0 0 63px;
	background-position: center;
	background-size: 120% 100%;background-repeat: no-repeat;
	margin-right: 11px;
	height: 75px;
}
.goods .foods-wrapper .food-list .food-item .content{
	flex: 1;
}

/* 具体内容样式 */ 
.goods .foods-wrapper .food-list .food-item .content .name{
	font-size: 16px;
	line-height: 21px;
	color: #333333;
	margin-bottom: 10px;
	padding-right: 27px;
}

.goods .foods-wrapper .food-list .food-item .content .desc{
	font-size: 10px;
	line-height: 19px;
	color: #bfbfbf;
	margin-bottom: 8px;
	
	/* 超出部分显示省略号*/
	-webkit-line-clamp: 1;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.goods .foods-wrapper .food-list .food-item .content .extra{
	font-size: 10px;
	color: #BFBFBF;
	margin-bottom: 7px;
}
.goods .foods-wrapper .food-list .food-item .content .extra .saled{
	margin-right: 14px;
}
.goods .foods-wrapper .food-list .food-item .content .product{
	height: 15px;
	margin-bottom: 6px;
}
.goods .foods-wrapper .food-list .food-item .content .price{
	font-size: 0;
}
.goods .foods-wrapper .food-list .food-item .content .price .text{
	font-size: 14px;
	color: #fb4e44;
}
.goods .foods-wrapper .food-list .food-item .content .price .unit{
	font-size: 12px;
	color: #BFBFBF;
}

/* 左边分类列表当前选中的样式 */ 
.goods .menu-wrapper .menu-item.current{
	background: white;
	font-weight: bold;
	margin-top: -1px;
}
.goods .menu-wrapper .menu-item:first-child.current{
	margin-top: 1px;
}

.goods .foods-wrapper .food-list .food-item .cartcontrol-wrapper{
	position: absolute;
	right: 0;
	bottom: 0;
}

.goods .menu-wrapper .menu-item .num{
	position: absolute;
	right: 5px;
	top: 5px;
	width: 13px;
	height: 13px;
	border-radius: 50%;
	color: white;
	background: red;
	text-align: center;
	font-size: 7px;
	line-height: 13px;
}

</style>

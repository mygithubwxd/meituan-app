<template>
	<!-- 底部购物车 -->
	<div class="shopcart" :class="{'highligh':totalCount>0}">
		<div class="shopcart-wrapper" >
			<!-- 底部左侧 -->
			<div class="content-left">
				<div class="logo-wrapper" :class="{'highligh':totalCount>0}">
					<!-- 给购物车图标绑定事件，当点击时展示购物车详情列表  -->
					<span class="icon-shopping_cart logo" :class="{'highligh':totalCount>0}" @click="toggleList"></span>
					<!-- 当有值的时候才会显示总的个数 -->
					<i class="num" v-show="totalCount">{{totalCount}}</i>
				</div>
				<div class="desc-wrapper">
					<!-- 当有值的时候才会显示总的价格  -->
					<p class="total-price" v-show="totalPrice">
						￥{{totalPrice}}
					</p>
					<p class="tip" :class="{'highligh':totalCount>0}">另需{{poiInfo.shipping_fee_tip}}</p>
				</div>
			</div>
			<!-- 底部右侧 -->
			<div class="content-right" :class="{'highligh':totalCount>0}">
				{{payStr}}
			</div>

			<!-- 购物车详情列表 -->
			<div class="shopcart-list" v-show="listShow" :class="{'show':listShow}">
				<!-- 详情列表最顶部 -->
				<div class="list-top" v-if="poiInfo.discounts2">
					{{poiInfo.discounts2[0].info}}
				</div>
				<!-- 详情列表头部 -->
				<div class="list-header">
					<h3 class="title">1号口袋</h3>
					<!-- 清空购物车 -->
					<div class="empty" @click="clearAll">
						<img src="./img/ash_bin.png" />
						<span>清空购物车</span>
					</div>
				</div>
				<!-- 详情列表内容部分 -->
				<div class="list-content" ref="listContent">
					<ul>
						<li class="food-item" v-for="(food,index) in selectFoods" :key="index">
							<div class="desc-wrapper">
								<div class="desc-left">
									<p class="name">{{food.name}}</p>
									<!-- 两者只能显示一个 -->
									<p class="unit" v-show="!food.description">{{food.unit}}</p>
									<p class="description" v-show="!food.unit">{{food.description}}</p>
								</div>
								<div class="desc-right">
									￥{{food.min_price}}
								</div>
							</div>
							<!-- 使用引入的购物车控件 -->
							<div class="cartcontrol-wrapper">
								<app-cart-control :food="food"></app-cart-control>
							</div>
						</li>
					</ul>
				</div>
				<div class="list-bottom"></div>
			</div>
		</div>
		<!-- 蒙板 -->
		<div class="shopcart-mask" v-show="listShow" @click="hideMask"></div>

	</div>
</template>

<script>
import BScroll from 'better-scroll'
import CartControl from '../cartcontrol/CartControl'
	export default {
		data(){
			return {
				fold:true
			}
		},
		//子组件通过props选项接收父组件传过来的参数
		//prop属性的属性值可以是一个数组，也可以是一个对象，来接收参数
		//当props 选项的属性值可以是对象时，组件可以为props指定验证要求
		//当prop验证失败时，Vue.js将拒绝在此子组件上设置此值
    props:{
      poiInfo:{
        type:Object,
        default:{}
			},
			selectFoods:{
				type:Array,
				default(){
					return [

					]
				}
			}
		},
		// 计算属性
		computed:{
			//总的个数
			totalCount(){
				let num = 0
				this.selectFoods.forEach((food) => {
					num += food.count
				})
				return num
			},
			//总的价格
			totalPrice(){
				let total = 0
				this.selectFoods.forEach((food) => {
					total += food.min_price * food.count
				})
				return total
			},
			//去结算
			payStr(){
				if(this.totalCount > 0){
					return "去结算"
				}else{
					return this.poiInfo.min_price_tip
				}
			},
			//购物车详情列表是否展示
			listShow(){
				if(!this.totalCount){
					this.fold = true
					return false
				}
				let show = !this.fold

				if(show){
					this.$nextTick(() => {
						if(!this.shopScroll){
							//第一个参数是要滚动的容器（DOM对象）
							this.shopScroll = new BScroll(this.$refs.listContent,{
								click:true
							})
						}else{
							//刷新
							this.shopScroll.refresh() 
						}
					})
				}
				return show
			}
		},
		methods:{
			//展示购物车详情列表
			toggleList(){
				// 判断购物车个数是否为空
				if(!this.totalCount){
					return;
				}
				this.fold = !this.fold
			},
			//清空购物车
			clearAll(){
				this.selectFoods.forEach((food) => {
					food.count = 0
				})
			},
			//点击蒙板，收回购物车详情列表
			hideMask(){
				this.fold = true
			}
		},
		components:{
			"app-cart-control":CartControl
		}
	}
</script>

<style>
@import url(../../common/css/icon.css);

.shopcart-wrapper{
	width: 100%;
	height: 51px;
	background: #514f4f;
	position: fixed;
	left: 0;
	bottom: 0;
	display: flex;
	z-index: 99;
}


/* 宽度随着屏幕的宽度变化而变化 */
.shopcart-wrapper .content-left{
	flex: 1;
}

/* 宽度不会随着屏幕的宽度变化而变化 */
.shopcart-wrapper .content-right{
	flex: 0 0 110px;

  font-size: 15px;
	color: #BAB9B9;
	line-height: 51px;
	text-align: center;
	font-weight: bold;
}

.shopcart-wrapper .content-left .logo-wrapper{
	width: 50px;
	height: 50px;
	background: #666666;
	border-radius: 50%;
	position: relative;
	top: -14px;
	left: 10px;
	text-align: center;
	float: left;
}

.shopcart-wrapper .content-left .logo-wrapper .logo{
	font-size: 28px;
	color: #c4c4c4;
	line-height: 50px;
}

.shopcart-wrapper .content-left .desc-wrapper{
	float: left;
	margin-left: 13px;
}

.shopcart-wrapper .content-left .desc-wrapper .tip{
	font-size: 12px;
	color: #bab9b9;
	line-height: 51px;
}


.shopcart-wrapper .content-left .logo-wrapper.highligh{
	background: #ffd161;
}
.shopcart-wrapper .content-left .logo-wrapper .logo.highligh{
	color: #2D2B2A;
}
.shopcart-wrapper .content-left .logo-wrapper .num{
	width: 15px;
	height: 15px;
	line-height: 15px;
	border-radius: 50%;
	font-size: 9px;
	color: white;
	background: red;
	position: absolute;
	right: 0;
	top: 0;
}
.shopcart-wrapper .content-left .desc-wrapper .tip.highligh{
	line-height: 12px;
}


.shopcart-wrapper .content-right.highligh{
	background: #FFD161;
	color: #2D2B2A;
}

.shopcart-wrapper .content-left .desc-wrapper .total-price {
    font-size: 18px;
    line-height: 33px;
    color: white;
}

.shopcart-wrapper .shopcart-list{
	position: absolute;
	left: 0;
	top: 0;
	z-index: -1;
	width: 100%;
}
.shopcart-wrapper .shopcart-list.show{
	transform: translateY(-100%);
}

.shopcart-wrapper .shopcart-list .list-top{
	height: 30px;
	text-align: center;
	font-size: 11px;
	background: #f3e6c6;
	line-height: 30px;
	color: #646158;
}

.shopcart-wrapper .shopcart-list .list-header{
	height: 30px;
	background: #F4F4F4;
}
.shopcart-wrapper .shopcart-list .list-header .title{
	float: left;
	border-left: 4px solid #53c123;
	padding-left: 6px;
	line-height: 30px;
	font-size: 12px;
}
.shopcart-wrapper .shopcart-list .list-header .empty{
	float: right;
	line-height: 30px;
	margin-right: 10px;
	font-size: 0;
}
.shopcart-wrapper .shopcart-list .list-header .empty img{
	height: 14px;
	margin-right: 9px;
	vertical-align: middle;
}
.shopcart-wrapper .shopcart-list .list-header .empty span{
	font-size: 12px;
	vertical-align: middle;
}

.shopcart-wrapper .shopcart-list .list-content{
	max-height: 360px;
	overflow: hidden;
	background: white;
}
.shopcart-wrapper .shopcart-list .list-content .food-item{
	height: 38px;
	padding: 12px 12px 10px 12px;
	border-bottom: 1px solid #F4F4F4;
}
.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper{
	float: left;
	width: 240px;
}
.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-left{
	float: left;
	width: 170px;
}
.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-left .name{
	font-size: 16px;
	margin-bottom: 8px;
	
	/* 超出部分隐藏*/
	-webkit-line-clamp: 1;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	overflow: hidden;
	height: 16px;
}
.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-left .unit{
	font-size: 12px;
	color: #B4B4B4;
}
.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-left .description{
	font-size: 12px;
	color: #B4B4B4;
		
	/* 超出部分隐藏*/
	overflow: hidden;
	height: 12px;
}
.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-right{
	float: right;
	width: 70px;
	text-align: right;	
}
.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-right .price{
	font-size: 12px;
	line-height: 38px;
}

.shopcart-wrapper .shopcart-list .list-content .food-item .cartcontrol-wrapper{
	float: right;
	margin-top: 6px;
}

.shopcart .shopcart-mask{
	position: fixed;
	top: 0;
	right: 0;
	width: 100%;
	height: 100%;
	z-index: 98;
	background: rgba(7,17,27,0.6);
}


</style>
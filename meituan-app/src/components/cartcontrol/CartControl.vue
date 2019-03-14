<template>
	<div class="cartcontrol">
		<!-- 减号 -->
			<!-- 减号出现时产生动画效果<transition> -->
		<transition name="move">
			<!-- 给符号绑定事件，事件修饰符 -->
      <div class="cart-decrease icon-remove_circle_outline" @click.stop.prevent="decreaseCart" v-show="food.count"></div>
    </transition>
		<!-- 数量 -->
    <div class="cart-count" v-show="food.count">{{food.count}}</div>
		<!-- 加号 -->
		<div class="cart-add icon-add_circle" @click.stop.prevent="increaseCart">
			<i class="bg"></i>
		</div>
	</div>
</template>

<script>
	// 引入vue模块
	import Vue from 'vue'

	export default {
    props:{
      food:{
        type:Object
      }
    },
		methods:{
			//减 -
      decreaseCart(){
        this.food.count--
			},
			//加 +
      increaseCart(){
        if(!this.food.count){
					// 使用vue的全局方法 
					// Vue.set( target, key, value )
					// 向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。
					// 它必须用于向响应式对象上添加新属性，因为 Vue 无法探测普通的新增属性
					// 如果没有该属性，则在第一次点击时为父组件给子组件利用props传值传过来的属性的属性值添加一个count属性，属性值为1 
          Vue.set(this.food,"count",1)  
        }else{
          this.food.count++
        }
      }
    }
	}
</script>

<style>

.cartcontrol{
	font-size: 0;
}

.cartcontrol .cart-decrease{
	display: inline-block;
	width: 26px;
	height: 26px;
	font-size: 26px;
	color: #b4b4b4;
}

.cartcontrol .cart-add .bg{
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background: black;
	position: absolute;
	left: 3px;
	top: 3px;
	z-index: -1;
}

.cartcontrol .cart-count{
	display: inline-block;
	width: 25px;
	text-align: center;
	font-size: 12px;
	line-height: 26px;
	vertical-align: top;
}

.cartcontrol .cart-add{
	display: inline-block;
	width: 26px;
	height: 26px;
	font-size: 26px;
	color: #ffd161;
	position: relative;
}

.move-enter-active,.move-leave-active{
	transition: all 0.5s linear;
}
.move-enter,.move-leave-to{
	transform: translateX(20px) rotate(180deg);
}
</style>

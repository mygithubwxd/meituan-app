<template>
  <div class="star">
    <!-- v-for根据数据源重复渲染该元素 -->
    <!-- 根据遍历的值给span添加对应的class，不同的class会添加不同的背景图片（不同的星星图片） -->
    <span class="star-item" v-for="(itemClass,index) in itemClasses" :key="index" :class="itemClass"></span>
  </div>
</template>

<script>

  // 星星长度 
  const LENGTH = 5

  // 星星的状态(类名)
  const CLS_ON = 'on'
  const CLS_HALF = 'half'
  const CLS_OFF = 'off'

  export default{

    //属性props中的数据可以直接使用（data computed props）
    props:{
      score:{   //属性传值（父>子）
        type:Number
      }
    },
    computed:{
      itemClasses(){

        // 定义一个数组，接收星星的状态（类名）
        let result = []

        // 4.7 
        // 对评分进行向下取整
        let score = Math.floor(this.score * 2) / 2

        // 半星
        // 取余 判断
        let hasDecimal = score % 1 !== 0

        // 全星
        let integer = Math.floor(score)

        // 遍历全星
        for(let i = 0; i < integer; i++){
          result.push(CLS_ON)
        }

        // 处理半星
        if(hasDecimal){
          result.push(CLS_HALF)
        }

        // 补齐
        while(result.length < LENGTH){
          result.push(CLS_OFF)
        }

        // 返回一个拥有5个元素的数组
        return result
      }
    }
  }
</script>

<style>
.star{
		font-size: 0;
	}
	.star .star-item{
		display: inline-block;
		width: 10px;
		height: 10px;
		margin-right: 3px;
		background-repeat: no-repeat;
		background-size: 10px 10px;
	}
	.star .star-item:last-child{
		margin-right: 0;
	}
	
	/* 三种图片类型*/
	.star .on{
		background-image: url(img/star24_on@2x.png);
	}
	.star .half{
		background-image: url(img/star24_half@2x.png);
	}
	.star .off{
		background-image: url(img/star24_off@2x.png);
	}
</style>


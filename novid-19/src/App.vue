<script setup lang="ts">
import { useStore } from '@/stores'
import { computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import chinaMap from '@/assets/china.json'
import { geoMap } from '@/assets/geoMap'
import type { GeoJSONSourceInput } from 'echarts/types/src/coord/geo/geoTypes'
import 'animate.css'

const store = useStore()

onMounted(async () => {
  await store.getList()
  initCharts()
  initPie()
  initBlock()
})

const initCharts = () => {
  const city = store.list.areaTree[2].children
  store.item = city[2].children

  store.pieData = store.list.areaTree[2].children.slice(3).map(item => {
    return {
      name: item.name,
      value: item.today.confirm
    }
  })

  const data = city.map((v) => {
    return {
      name: v.name,
      value: geoMap[v.name].concat(v.today.confirm),
      children: v.children
    }
  })

  const charts = echarts.init(document.querySelector('#china') as HTMLElement)

  echarts.registerMap('china', chinaMap as GeoJSONSourceInput)
  charts.setOption({
    // backgroundColor: '#000000',
    geo: {
      map: 'china',
      aspectScale: 0.98,
      layoutCenter: ['50%', '50%'],
      layoutSize: '100%',
      itemStyle: {
        areaColor: {
          type: 'linear-gradient',
          x: 0,
          y: 1200,
          x2: 1000,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: '#152E6E' // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#0673AD' // 50% 处的颜色
            }
          ],
          global: true // 缺省为 false
        },
        shadowColor: '#0f5d9d',
        shadowOffsetX: 0,
        shadowOffsetY: 15,
        opacity: 0.5
      },
      emphasis: {
        areaColor: '#0f5d9d'
      },
      regions: [
        {
          name: '南海诸岛',
          itemStyle: {
            areaColor: 'rgba(0, 10, 52, 1)',
            borderColor: 'rgba(0, 10, 52, 1)',
            opacity: 0,
            label: {
              show: true,
              color: '#009cc9'
            }
          },
          label: {
            show: true,
            color: '#FFFFFF',
            fontSize: 11
          }
        }
      ]
    },
    series: [
      {
        type: 'map',
        // selectedMode: 'multiple',
        map: 'china',
        aspectScale: 1,
        layoutCenter: ['50%', '50%'], //地图位置
        layoutSize: '100%',
        zoom: 0.8, //当前视角的缩放比例
        // roam: true, //是否开启平游或缩放
        scaleLimit: {
          //滚轮缩放的极限控制
          min: 1,
          max: 2
        },
        label: {
          show: true,
          color: '#FFFFFF',
          fontSize: 10
        },
        itemStyle: {
          areaColor: '#0c3653',
          borderColor: '#1cccff',
          borderWidth: 1.8
        },
        data: data,
        emphasis: {
          areaColor: '#56b1da',
          show: true,
          color: '#fff'
        }
      },
      {
        name: 'Top 5',
        type: 'scatter',
        coordinateSystem: 'geo',
        //   symbol: 'image://http://ssq168.shupf.cn/data/biaoji.png',
        // symbolSize: [30,120],
        // symbolOffset:[0, '-40%'] ,
        symbol: 'pin',
        symbolSize: [35, 30],
        label: {
          show: true,
          color: '#fff',
          formatter(value: any) {
            return value.data.value[2]
          }
        },
        itemStyle: {
          color: '#40c5fa' //标志颜色
        },
        data: data
        /*showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        zlevel: 1*/
      }
    ]
  })
  charts.on('click', (params: any) => {
    console.log(params)
    store.item = params.data.children
  })
}


const nowConfirm = computed(() => {
  const total = store.chinaTotal
  return total.confirm - total.heal - total.dead
})

const initPie = () => {
  const charts = echarts.init(document.querySelector('.box-left-pie') as HTMLElement)
  charts.setOption({
    /*title: {
      text: '疫情分析图',
      subtext: '确诊',
      left: 'center',
      textStyle: {
        color: 'white'
      }
    },*/
    backgroundColor: '#223651',
    tooltip: {
      trigger: 'item',
    },
   /* legend: {
      top: '5%',
      left: 'center',
      textStyle: {
        color: 'white'
      }
    },*/
    series: [
      {
        // name: '累计确诊',
        type: 'pie',
        // radius: ['40%', '70%'],
        radius: '50%',
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        /*label: {
          show: false,
          position: 'center',
          color: 'white'
        },*/
        emphasis: {
          /*label: {
            show: true,
            fontSize: 15,
            fontWeight: 'bold'
          }*/
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        labelLine: {
          show: true,
        },
        data: store.pieData
      }
    ]
  })
}

const initBlock = () => {
  const charts = echarts.init(document.querySelector('.box-left-block') as HTMLElement)
  charts.setOption({
    backgroundColor: '#223651',
    xAxis: {
      type: 'category',
      data: store.pieData.map(item => item.name)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: store.pieData.map(item => item.value),
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ]
  })
}
</script>

<template>
  <div class="box">
    <div class="box-left">
      <div class="box-left-card">
        <div>
          <div>现有确诊</div>
          <div>{{ nowConfirm }}</div>
          <div>
            较昨日<span>+{{ store.chinaAdd.storeConfirm }}</span>
          </div>
        </div>
        <div>
          <div>累计确诊</div>
          <div>{{ store.chinaTotal.confirm }}</div>
          <div>
            较昨日<span>+{{ store.chinaAdd.confirm }}</span>
          </div>
        </div>
        <div>
          <div>境外输入</div>
          <div>{{ store.chinaTotal.input }}</div>
          <div>
            较昨日<span>+{{ store.chinaAdd.input }}</span>
          </div>
        </div>
        <div>
          <div>累计死亡</div>
          <div>{{ store.chinaTotal.dead }}</div>
          <div>
            较昨日<span style="color: yellow">+{{ store.chinaAdd.dead }}</span>
          </div>
        </div>
        <div>
          <div>累计治愈</div>
          <div>{{ store.chinaTotal.heal }}</div>
          <div>
            较昨日<span>+{{ store.chinaAdd.heal }}</span>
          </div>
        </div>
      </div>
      <div class="box-left-pie"></div>
      <div class="box-left-block"></div>
    </div>
    <div class="box-center">
      <div class="header">
        <h1>疫情数据分析中心</h1>
        <p>数据截至: {{ store.list.lastUpdateTime }}</p>
      </div>
      <div id="china" style="height: 800px"></div>
    </div>
    <div class="box-right">
      <table>
        <thead>
          <tr>
            <th>地区</th>
            <th>新增</th>
            <th>累计</th>
            <th>治疗</th>
            <th>死亡</th>
          </tr>
        </thead>
        <transition-group tag="tbody" enter-active-class="animate__animated animate__flipInY">
          <tr v-for="item in store.item" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.today.confirm }}</td>
            <td>{{ item.total.confirm }}</td>
            <td>{{ item.total.heal }}</td>
            <td>{{ item.total.dead }}</td>
          </tr>
        </transition-group>
      </table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.box {
  height: 100%;
  display: flex;
  background: url('./assets/bg.jpg') no-repeat;
  background-size: cover;

  &-left {
    width: 400px;

    .box-left-card {
      background-color: #223651;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      color: white;
      text-align: center;

      & > div:nth-child(1),
      & > div:nth-child(2) {
        width: 50%;
        border-bottom: 2px solid rgba(0, 0, 0, 0.5);
        padding-bottom: 10px;
      }

      & > div {
        padding: 10px 0;
        width: 30%;

        div:nth-child(2) {
          font-size: 23px;
          color: red;
        }

        span {
          color: yellow;
        }
      }
    }

    .box-left-pie {
      height: 350px;
      margin-top: 5px;
    }

    .box-left-block {
      height: 300px;

    }
  }

  &-center {
    flex: 1;
    padding: 0 50px;

    .header {
      color: white;
      border-radius: 6px;
      padding: 10px 0;
      background-color: #223651;
      text-align: center;
    }
  }

  &-right {
    width: 400px;

    table {
      background-color: #223651;
    }

    td,
    table {
      border: 1px solid #fff;
      border-collapse: collapse;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    td,
    th {
      color: white;
      min-width: 80px;
      font-size: 11px;
      padding: 4px 0;
    }
  }
}
</style>

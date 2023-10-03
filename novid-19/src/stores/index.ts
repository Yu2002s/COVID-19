import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getApiList } from '@/server'
import type { Children, ChinaToday, ChinaTotal, RootObject } from '@/stores/types'

export const useStore = defineStore('counter', () => {
  const list = ref(<RootObject>{})
  const item = ref(<Children[]>[])
  const chinaAdd = ref(<ChinaToday>{})
  const chinaTotal = ref(<ChinaTotal>{})
  const pieData = ref(<{name: string, value: number}[]>[])

  async function getList() {
    list.value = await getApiList()
    chinaAdd.value = list.value.chinaTotal.today
    chinaTotal.value = list.value.chinaTotal.total
  }
  return {
    list,
    item,
    pieData,
    chinaAdd,
    chinaTotal,
    getList
  }
})

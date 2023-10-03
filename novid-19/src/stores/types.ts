export interface RootObject {
  status: string;
  chinaTotal: Children;
  chinaDayList: ChinaDayList[];
  lastUpdateTime: string;
  overseaLastUpdateTime: string;
  areaTree: AreaTree[];
}
export interface ChinaToday {
  confirm: number;
  heal: number;
  dead: number;
  storeConfirm: number;
  input: number;
}
export interface ChinaTotal {
  confirm: number;
  suspect: number;
  heal: number;
  dead: number;
  severe: number;
  input: number;
}
export interface ChinaTotalExtData {
  noSymptom: number;
  incrNoSymptom: number;
}
export interface Children {
  today: ChinaToday;
  total: ChinaTotal;
  extData: ChinaTotalExtData;
  name: string
}
export interface ChinaDayListToday {
  confirm: number;
  suspect: number;
  heal: number;
  dead: number;
  severe: number;
}
export interface ChinaDayListTotal {
  confirm: number;
  suspect: number;
  heal: number;
  dead: number;
  severe: number;
  input: number;
}
export interface ChinaDayList {
  date: string;
  today: ChinaDayListToday;
  total: ChinaDayListTotal;
}
export interface AreaTreeToday {
  confirm: number;
  heal: number;
  dead: number;
}
export interface AreaTreeTotal {
  confirm: number;
  suspect: number;
  heal: number;
  dead: number;
  severe: number;
  input: number;
}
export interface AreaTreeExtData {

}
export interface AreaTree {
  today: ChinaToday;
  total: ChinaTotal;
  extData: AreaTreeExtData;
  name: string;
  id: string;
  lastUpdateTime: string;
  children: any[];
}
"use strict";
import Vue from "vue";
export default function treeToArray(
  data,
  expandAll,
  parent = null,
  level = null
) {
  let tmp = [];
  Array.from(data).forEach(function(record) {
    if (record._expanded === undefined) {
      Vue.set(record, "_expanded", expandAll);
    }
    let _level = 1;
    if (level !== undefined && level !== null) {
      _level = level + 1;
    }
    Vue.set(record, "_level", _level);
    // 如果有父元素
    if (parent) {
      Vue.set(record, "parent", parent);
    }
    tmp.push(record);
    if (record.childrens && record.childrens.length > 0) {
      const child = treeToArray(record.childrens, expandAll, record, _level);
      tmp = tmp.concat(child);
    }
  });
  return tmp;
}


export function treeToArrayTable(
  data,
  expandAll,
  parent = null,
  level = null
) {
  let tmp = [];
  Array.from(data).forEach(function(record) {
    if (!record){
      return;
    }
    if ( record._expanded === undefined) {
      Vue.set(record, "_expanded", expandAll);
    }
    let _level = 1;
    if (level !== undefined && level !== null) {
      _level = level + 1;
    }
    Vue.set(record, "_level", _level);
    // 如果有父元素
    if (parent) {
      Vue.set(record, "parent", parent);
    }
    tmp.push(record);
    if (record.childrens && record.childrens.length > 0) {
      const child = treeToArray(record.childrens, expandAll, record, _level);
      tmp = tmp.concat(child);
    }
  });
  return tmp;
}

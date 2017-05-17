'use strict';
/**
 * 公共Actions，所有action均需统一在此文件登记，以防重名造成store冲突
 * @type {actions}
 */

export const Actions = Reflux.createActions([
    'repaint', // 接收到数据，重新渲染
    'selectPower',
    'selectColor',


    'getBeforData',//获取过往数据
    'changeWeekList',
    'getWeekList',
    'changeSwitch',
    'setTimingObject',
    'getTimingObject',



    'judgeClock',
    'submitTimeData',
    'addClock',
    'deviceClick',
    'repeatSelect',
    'repeatSure',
    'repeatCancel',
    'offon',
    'changejudge',
]);
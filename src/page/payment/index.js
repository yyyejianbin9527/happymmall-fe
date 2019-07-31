/*
* @Author: Administrator
* @Date:   2019-07-31 16:28:13
* @Last Modified by:   Administrator
* @Last Modified time: 2019-07-31 16:53:21
*/
'use strict';
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide         = require('page/common/nav-side/index.js');
var _mm             = require('util/mm.js');
var _payment          = require('service/payment-service.js');
var templateIndex   = require('./index.string');

// page 逻辑部分
var page = {
    data:{
        orderNumber : _mm.getUrlParam("orderNumber")
    },
    init: function(){
        this.onLoad();
    },
    onLoad : function(){

        // 加载订单详情
        this.loadPaymentInfo();
    },
    // 加载订单列表
    loadPaymentInfo : function(){
        var _this           = this,
            paymentHtml     = '',
            $pageWrap        = $('.page-wrap');
        $pageWrap.html('<div class="loading"></div>');
        _payment.getPaymentInfo(this.data.orderNumber,function(){
            // 渲染 html
            paymentHtml = _mm.rendHtml(templateIndex,res);
            $pageWrap.html(paymentHtml);
            _this.listenOrderStatus();
        },function(errMsg){
            $pageWrap.html('<p class="err-tip">'+errMsg+'</p>');
        });
    },
    // 监听订单状态
    listenOrderStatus : function(){
        var _this = this;
        this.paymentTimer = window.setInterval(function(){
            _payment.getPaymentStatus(_this.data.orderNumber,function(res){
                if (res == true) {
                    window.location.href = './result.html?type=payment&orderNumber='
                        +_this.data.orderNumber;
                }
            });
        },5e3);
    }
};
$(function(){
    page.init();
});
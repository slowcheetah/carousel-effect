(function ($) {
  'use strict';
  let settings;
  let containerWidth;
  let blockWidth;
  let minBlockWidth;
  let frontXShift;
  let backXShift;
  let methods = {
    init: function (options) {
      settings = $.extend({
        leftSelector: '.slide-left',
        rightSelector: '.slide-right',
        scale: 0.85,
        turnOverLeftClass: 'turn-over-left',
        turnAwayLeftClass: 'turn-away-left',
        turnOverRightClass: 'turn-over-right',
        turnAwayRightClass: 'turn-away-right',
        activeClass: 'active',
        frontZIndex: 5,
        backZIndex: 4
      }, options);

      return this.each(function () {
        containerWidth = $(this).width();
        blockWidth = $(settings.leftSelector).width();
        minBlockWidth = Math.ceil(blockWidth * settings.scale);
        frontXShift = Math.floor(blockWidth / 4);
        backXShift = Math.floor(minBlockWidth / 4 * settings.scale);
        console.log(frontXShift);
        console.log(backXShift);
        _buildAnimation();
        _bindEvents();
      });
    },
    right: function () {
      if ($(settings.rightSelector).hasClass(settings.activeClass)) {
        return;
      }
      $(settings.rightSelector).addClass(settings.turnOverRightClass);
      $(settings.rightSelector).one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
        $(settings.rightSelector).addClass(settings.activeClass);
        $(settings.rightSelector).removeClass(settings.turnOverRightClass);
      });
      $(settings.leftSelector).addClass(settings.turnAwayLeftClass);
      $(settings.leftSelector).one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
        $(settings.leftSelector).removeClass(settings.activeClass);
        $(settings.leftSelector).removeClass(settings.turnAwayLeftClass);
      });
      if (settings.onChange !== undefined) {
        settings.onChange('right');
      }
    },
    left: function () {
      if ($(settings.leftSelector).hasClass(settings.activeClass)) {
          return;
      }
      $(settings.leftSelector).addClass(settings.turnOverLeftClass);
      $(settings.leftSelector).one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
        $(settings.leftSelector).addClass(settings.activeClass);
        $(settings.leftSelector).removeClass(settings.turnOverLeftClass);
      });
      $(settings.rightSelector).addClass(settings.turnAwayRightClass);
      $(settings.rightSelector).one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
        $(settings.rightSelector).removeClass(settings.activeClass);
        $(settings.rightSelector).removeClass(settings.turnAwayRightClass);
      });
      if (settings.onChange !== undefined) {
        settings.onChange('left');
      }
    },
  };

  $.fn.slideEffect = function (method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' not found in jQuery.slideEffect');
    }
  };

  let style = document.createElement('style');
  let _addKeyFrames = null;
  document.head.appendChild(style);
  if (CSS && CSS.supports && CSS.supports('animation: name')) {
    _addKeyFrames = function (name, frames) {
      let pos = style.sheet.length;
      style.sheet.insertRule(
        "@keyframes " + name + "{" + frames + "}", pos);
    }
  } else {
    _addKeyFrames = function (name, frames) {
      let str = name + "{" + frames + "}";
      let pos = style.sheet.length;
      style.sheet.insertRule("@-webkit-keyframes " + str, pos);
      style.sheet.insertRule("@keyframes " + str, pos + 1);
    }
  }

  let _buildAnimation = function() {
    _addKeyFrames(
      settings.turnOverLeftClass,
      `20% {left: 0;}` +
      `60% {z-index: ${settings.frontZIndex};}` +
      `80% {transform: scale(1);}` +
      `to {left: ${frontXShift}px; z-index: ${settings.frontZIndex}; transform: scale(1);}`
    );
    _addKeyFrames(
      settings.turnAwayLeftClass,
      `20% {left: 0;}` +
      `60% {z-index: ${settings.backZIndex};}` +
      `80% {transform: scale(${settings.scale})}` +
      `to {left: ${backXShift}px; z-index: ${settings.backZIndex}; transform: scale(${settings.scale});}`
    );
    _addKeyFrames(
      settings.turnOverRightClass,
      `20% {right: 0;}` +
      `60% {z-index: ${settings.frontZIndex};}` +
      `80% {transform: scale(1);}` +
      `to {right: ${frontXShift}px; z-index: ${settings.frontZIndex}; transform: scale(1);}`
    );
    _addKeyFrames(
      settings.turnAwayRightClass,
        `20% {right: 0;}` +
        `60% {z-index: ${settings.backZIndex};}` +
        `80% {transform: scale(${settings.scale})}` +
        `to {right: ${backXShift}px; z-index: ${settings.backZIndex}; transform: scale(${settings.scale});}`
    );
    let pos = style.sheet.length;
    style.sheet.insertRule(`.${settings.turnOverLeftClass} {animation: ${settings.turnOverLeftClass} 0.7s ease-in-out forwards;}`, pos);
    style.sheet.insertRule(`.${settings.turnAwayLeftClass} {animation: ${settings.turnAwayLeftClass} 0.7s ease-in-out forwards;}`, pos);
    style.sheet.insertRule(`.${settings.turnOverRightClass} {animation: ${settings.turnOverRightClass} 0.7s ease-in-out forwards;}`, pos);
    style.sheet.insertRule(`.${settings.turnAwayRightClass} {animation: ${settings.turnAwayRightClass} 0.7s ease-in-out forwards;}`, pos);

    style.sheet.insertRule(`${settings.leftSelector}.${settings.activeClass} {left: ${frontXShift}px !important;}`, pos);
    style.sheet.insertRule(`${settings.rightSelector}.${settings.activeClass} {right: ${frontXShift}px !important;}`, pos);
    style.sheet.insertRule(`${settings.leftSelector} {left: ${backXShift}px !important;}`, pos);
    style.sheet.insertRule(`${settings.rightSelector} {right: ${backXShift}px !important;}`, pos);
  };

  let _bindEvents = function() {
    $(settings.leftSelector).click(function(e){
      e.preventDefault();
      e.stopPropagation();
      methods.left();
    });
    $(settings.rightSelector).click(function(e){
      e.preventDefault();
      e.stopPropagation();
      methods.right();
    })
  };
})(jQuery);
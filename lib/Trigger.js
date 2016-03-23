'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _rcUtil = require('rc-util');

var _Popup = require('./Popup');

var _Popup2 = _interopRequireDefault(_Popup);

var _utils = require('./utils');

function noop() {}

function returnEmptyString() {
  return '';
}

var ALL_HANDLERS = ['onClick', 'onMouseDown', 'onTouchStart', 'onMouseEnter', 'onMouseLeave', 'onFocus', 'onBlur'];

var Trigger = _react2['default'].createClass({
  displayName: 'Trigger',

  propTypes: {
    action: _react.PropTypes.any,
    getPopupClassNameFromAlign: _react.PropTypes.any,
    onPopupVisibleChange: _react.PropTypes.func,
    afterPopupVisibleChange: _react.PropTypes.func,
    popup: _react.PropTypes.node.isRequired,
    popupStyle: _react.PropTypes.object,
    popupClassName: _react.PropTypes.string,
    popupPlacement: _react.PropTypes.string,
    builtinPlacements: _react.PropTypes.object,
    popupTransitionName: _react.PropTypes.string,
    popupAnimation: _react.PropTypes.any,
    mouseEnterDelay: _react.PropTypes.number,
    mouseLeaveDelay: _react.PropTypes.number,
    getPopupContainer: _react.PropTypes.func,
    destroyPopupOnHide: _react.PropTypes.bool,
    popupAlign: _react.PropTypes.object,
    popupVisible: _react.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      prefixCls: 'rc-trigger-popup',
      getPopupClassNameFromAlign: returnEmptyString,
      onPopupVisibleChange: noop,
      afterPopupVisibleChange: noop,
      popupClassName: '',
      mouseEnterDelay: 0,
      mouseLeaveDelay: 0.1,
      popupStyle: {},
      destroyPopupOnHide: false,
      popupAlign: {},
      defaultPopupVisible: false,
      action: []
    };
  },

  getInitialState: function getInitialState() {
    var props = this.props;
    var popupVisible = undefined;
    if ('popupVisible' in props) {
      popupVisible = !!props.popupVisible;
    } else {
      popupVisible = !!props.defaultPopupVisible;
    }
    return { popupVisible: popupVisible };
  },

  componentDidMount: function componentDidMount() {
    this.componentDidUpdate({}, {
      popupVisible: this.state.popupVisible
    });
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if ('popupVisible' in nextProps) {
      this.setState({
        popupVisible: !!nextProps.popupVisible
      });
    }
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    var _this = this;

    var props = this.props;
    var state = this.state;
    if (this.popupRendered) {
      var _ret = (function () {
        var self = _this;
        _reactDom2['default'].unstable_renderSubtreeIntoContainer(_this, _this.getPopupElement(), _this.getPopupContainer(), function renderPopup() {
          if (this.isMounted()) {
            self.popupDomNode = (0, _reactDom.findDOMNode)(this);
          } else {
            self.popupDomNode = null;
          }
          if (prevState.popupVisible !== state.popupVisible) {
            props.afterPopupVisibleChange(state.popupVisible);
          }
        });
        if (props.action.indexOf('click') !== -1) {
          if (state.popupVisible) {
            if (!_this.clickOutsideHandler) {
              _this.clickOutsideHandler = _rcUtil.Dom.addEventListener(document, 'mousedown', _this.onDocumentClick);
              _this.touchOutsideHandler = _rcUtil.Dom.addEventListener(document, 'touchstart', _this.onDocumentClick);
            }
            return {
              v: undefined
            };
          }
        }
        if (_this.clickOutsideHandler) {
          _this.clickOutsideHandler.remove();
          _this.touchOutsideHandler.remove();
          _this.clickOutsideHandler = null;
          _this.touchOutsideHandler = null;
        }
      })();

      if (typeof _ret === 'object') return _ret.v;
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    var popupContainer = this.popupContainer;
    if (popupContainer) {
      _reactDom2['default'].unmountComponentAtNode(popupContainer);
      if (this.props.getPopupContainer) {
        var mountNode = this.props.getPopupContainer((0, _reactDom.findDOMNode)(this));
        mountNode.removeChild(popupContainer);
      } else {
        document.body.removeChild(popupContainer);
      }
      this.popupContainer = null;
    }
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
    if (this.clickOutsideHandler) {
      this.clickOutsideHandler.remove();
      this.touchOutsideHandler.remove();
      this.clickOutsideHandler = null;
      this.touchOutsideHandler = null;
    }
  },

  onMouseEnter: function onMouseEnter() {
    this.delaySetPopupVisible(true, this.props.mouseEnterDelay);
  },

  onMouseLeave: function onMouseLeave() {
    this.delaySetPopupVisible(false, this.props.mouseLeaveDelay);
  },

  onFocus: function onFocus() {
    this.focusTime = Date.now();
    this.setPopupVisible(true);
  },

  onMouseDown: function onMouseDown() {
    this.preClickTime = Date.now();
  },

  onTouchStart: function onTouchStart() {
    this.preTouchTime = Date.now();
  },

  onBlur: function onBlur() {
    this.setPopupVisible(false);
  },

  onClick: function onClick(event) {
    // focus will trigger click
    if (this.focusTime) {
      var preTime = undefined;
      if (this.preClickTime && this.preTouchTime) {
        preTime = Math.min(this.preClickTime, this.preTouchTime);
      } else if (this.preClickTime) {
        preTime = this.preClickTime;
      } else if (this.preTouchTime) {
        preTime = this.preTouchTime;
      }
      if (Math.abs(preTime - this.focusTime) < 20) {
        return;
      }
      this.focusTime = 0;
    }
    this.preClickTime = 0;
    this.preTouchTime = 0;
    event.preventDefault();
    this.setPopupVisible(!this.state.popupVisible);
  },

  onDocumentClick: function onDocumentClick(event) {
    var target = event.target;
    var root = (0, _reactDom.findDOMNode)(this);
    var popupNode = this.getPopupDomNode();
    if (!_rcUtil.Dom.contains(root, target) && !_rcUtil.Dom.contains(popupNode, target)) {
      this.setPopupVisible(false);
    }
  },

  getPopupDomNode: function getPopupDomNode() {
    // for test
    return this.popupDomNode;
  },

  getPopupContainer: function getPopupContainer() {
    if (!this.popupContainer) {
      this.popupContainer = document.createElement('div');
      if (this.props.getPopupContainer) {
        var mountNode = this.props.getPopupContainer((0, _reactDom.findDOMNode)(this));
        mountNode.appendChild(this.popupContainer);
      } else {
        document.body.appendChild(this.popupContainer);
      }
    }
    return this.popupContainer;
  },

  getPopupClassNameFromAlign: function getPopupClassNameFromAlign(align) {
    var className = [];
    var props = this.props;
    var popupPlacement = props.popupPlacement;
    var builtinPlacements = props.builtinPlacements;
    var prefixCls = props.prefixCls;

    if (popupPlacement && builtinPlacements) {
      className.push((0, _utils.getPopupClassNameFromAlign)(builtinPlacements, prefixCls, align));
    }
    if (props.getPopupClassNameFromAlign) {
      className.push(props.getPopupClassNameFromAlign(align));
    }
    return className.join(' ');
  },

  getPopupAlign: function getPopupAlign() {
    var props = this.props;
    var popupPlacement = props.popupPlacement;
    var popupAlign = props.popupAlign;
    var builtinPlacements = props.builtinPlacements;

    if (popupPlacement && builtinPlacements) {
      return (0, _utils.getAlignFromPlacement)(builtinPlacements, popupPlacement, popupAlign);
    }
    return popupAlign;
  },

  getPopupElement: function getPopupElement() {
    var props = this.props;
    var state = this.state;
    var mouseProps = {};
    if (props.action.indexOf('hover') !== -1) {
      mouseProps.onMouseEnter = this.onMouseEnter;
      mouseProps.onMouseLeave = this.onMouseLeave;
    }
    return _react2['default'].createElement(
      _Popup2['default'],
      _extends({ prefixCls: props.prefixCls,
        destroyPopupOnHide: props.destroyPopupOnHide,
        visible: state.popupVisible,
        className: props.popupClassName,
        action: props.action,
        align: this.getPopupAlign(),
        animation: props.popupAnimation,
        getClassNameFromAlign: this.getPopupClassNameFromAlign
      }, mouseProps, {
        wrap: this,
        style: props.popupStyle,
        transitionName: props.popupTransitionName }),
      props.popup
    );
  },

  setPopupVisible: function setPopupVisible(popupVisible) {
    if (this.state.popupVisible !== popupVisible) {
      if (!('popupVisible' in this.props)) {
        this.setState({
          popupVisible: popupVisible
        });
      }
      this.props.onPopupVisibleChange(popupVisible);
    }
  },

  delaySetPopupVisible: function delaySetPopupVisible(visible, delayS) {
    var _this2 = this;

    var delay = delayS * 1000;
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
    if (delay) {
      this.delayTimer = setTimeout(function () {
        _this2.setPopupVisible(visible);
        _this2.delayTimer = null;
      }, delay);
    } else {
      this.setPopupVisible(visible);
    }
  },

  render: function render() {
    this.popupRendered = this.popupRendered || this.state.popupVisible;
    var props = this.props;
    var children = props.children;
    var child = _react2['default'].Children.only(children);
    var childProps = child.props || {};
    var newChildProps = {};
    var trigger = props.action;
    if (trigger.indexOf('click') !== -1) {
      newChildProps.onClick = (0, _rcUtil.createChainedFunction)(this.onClick, childProps.onClick);
      newChildProps.onMouseDown = (0, _rcUtil.createChainedFunction)(this.onMouseDown, childProps.onMouseDown);
      newChildProps.onTouchStart = (0, _rcUtil.createChainedFunction)(this.onTouchStart, childProps.onTouchStart);
    }
    if (trigger.indexOf('hover') !== -1) {
      newChildProps.onMouseEnter = (0, _rcUtil.createChainedFunction)(this.onMouseEnter, childProps.onMouseEnter);
      newChildProps.onMouseLeave = (0, _rcUtil.createChainedFunction)(this.onMouseLeave, childProps.onMouseLeave);
    }
    if (trigger.indexOf('focus') !== -1) {
      newChildProps.onFocus = (0, _rcUtil.createChainedFunction)(this.onFocus, childProps.onFocus);
      newChildProps.onBlur = (0, _rcUtil.createChainedFunction)(this.onBlur, childProps.onBlur);
    }

    ALL_HANDLERS.forEach(function (handler) {
      var newFn = undefined;
      if (props[handler] && newChildProps[handler]) {
        newFn = (0, _rcUtil.createChainedFunction)(props[handler], newChildProps[handler]);
      } else {
        newFn = props[handler] || newChildProps[handler];
      }
      if (newFn) {
        newChildProps[handler] = newFn;
      }
    });

    return _react2['default'].cloneElement(child, newChildProps);
  }
});

exports['default'] = Trigger;
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _rcAlign = require('rc-align');

var _rcAlign2 = _interopRequireDefault(_rcAlign);

var _rcAnimate = require('rc-animate');

var _rcAnimate2 = _interopRequireDefault(_rcAnimate);

var Popup = _react2['default'].createClass({
  displayName: 'Popup',

  propTypes: {
    visible: _react.PropTypes.bool,
    wrap: _react.PropTypes.object,
    style: _react.PropTypes.object,
    getClassNameFromAlign: _react.PropTypes.func,
    onMouseEnter: _react.PropTypes.func,
    onAnimateLeave: _react.PropTypes.func,
    className: _react.PropTypes.string,
    onMouseLeave: _react.PropTypes.func
  },

  componentDidMount: function componentDidMount() {
    this.rootNode = this.getPopupDomNode();
  },

  onAlign: function onAlign(popupDomNode, align) {
    var props = this.props;
    var alignClassName = props.getClassNameFromAlign(props.align);
    var currentAlignClassName = props.getClassNameFromAlign(align);
    if (alignClassName !== currentAlignClassName) {
      this.currentAlignClassName = currentAlignClassName;
      popupDomNode.className = this.getClassName(currentAlignClassName);
    }
  },

  onAnimateLeave: function onAnimateLeave() {
    this.props.onAnimateLeave();
  },

  getPopupDomNode: function getPopupDomNode() {
    return _reactDom2['default'].findDOMNode(this);
  },

  getTarget: function getTarget() {
    return _reactDom2['default'].findDOMNode(this.props.wrap);
  },

  getTransitionName: function getTransitionName() {
    var props = this.props;
    var transitionName = props.transitionName;
    if (!transitionName && props.animation) {
      transitionName = props.prefixCls + '-' + props.animation;
    }
    return transitionName;
  },

  getClassName: function getClassName(currentAlignClassName) {
    var props = this.props;
    var prefixCls = props.prefixCls;

    var className = prefixCls + ' ' + props.className + ' ';
    className += currentAlignClassName;
    var hiddenClass = prefixCls + '-hidden';
    if (!props.visible) {
      className += ' ' + hiddenClass;
    }
    return className;
  },

  render: function render() {
    var props = this.props;
    var align = props.align;
    var style = props.style;
    var visible = props.visible;

    var className = this.getClassName(this.currentAlignClassName || props.getClassNameFromAlign(align));
    if (!visible) {
      this.currentAlignClassName = null;
    }
    return _react2['default'].createElement(
      _rcAnimate2['default'],
      { component: '',
        exclusive: true,
        transitionAppear: true,
        onLeave: this.onAnimateLeave,
        transitionName: this.getTransitionName(),
        showProp: 'data-visible' },
      _react2['default'].createElement(
        _rcAlign2['default'],
        { target: this.getTarget,
          key: 'popup',
          monitorWindowResize: true,
          'data-visible': visible,
          disabled: !visible,
          align: align,
          onAlign: this.onAlign },
        _react2['default'].createElement(
          'div',
          { className: className,
            onMouseEnter: props.onMouseEnter,
            onMouseLeave: props.onMouseLeave,
            style: style },
          props.children
        )
      )
    );
  }
});

exports['default'] = Popup;
module.exports = exports['default'];
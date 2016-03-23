'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var LazyRenderBox = _react2["default"].createClass({
  displayName: 'LazyRenderBox',

  propTypes: {
    children: _react.PropTypes.any,
    visible: _react.PropTypes.bool,
    prefixCls: _react.PropTypes.string
  },
  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    return nextProps.visible;
  },
  render: function render() {
    if (_react2["default"].Children.count(this.props.children) > 1) {
      return _react2["default"].createElement(
        'div',
        { className: this.props.prefixCls + '-content' },
        this.props.children
      );
    }
    return _react2["default"].Children.only(this.props.children);
  }
});

exports["default"] = LazyRenderBox;
module.exports = exports['default'];
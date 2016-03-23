'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LazyRenderBox = _react2.default.createClass({
  displayName: 'LazyRenderBox',

  propTypes: {
    children: _react.PropTypes.any,
    visible: _react.PropTypes.bool
  },
  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    return nextProps.visible;
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      null,
      this.props.children
    );
  }
});

exports.default = LazyRenderBox;
module.exports = exports['default'];
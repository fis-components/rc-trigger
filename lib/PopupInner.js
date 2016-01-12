'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var PopupInner = _react2['default'].createClass({
  displayName: 'PopupInner',

  propTypes: {
    hiddenClassName: _react.PropTypes.string,
    className: _react.PropTypes.string,
    onMouseEnter: _react.PropTypes.func,
    onMouseLeave: _react.PropTypes.func,
    children: _react.PropTypes.any
  },
  render: function render() {
    var props = this.props;
    var className = props.className;
    if (!props.visible) {
      className += ' ' + props.hiddenClassName;
    }
    return _react2['default'].createElement(
      'div',
      { className: className,
        onMouseEnter: props.onMouseEnter,
        onMouseLeave: props.onMouseLeave,
        style: props.style },
      props.children
    );
  }
});

exports['default'] = PopupInner;
module.exports = exports['default'];
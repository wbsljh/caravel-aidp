// JS
window.jQuery = window.$ = require('jquery');
require('jquery-ui');
require('bootstrap-datepicker');
require('../node_modules/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN.js');
require('../node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css');
require('../node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker3.standalone.css');

import React from 'react';
import ReactDOM from 'react-dom';

const propTypes = {
  origSelectedValues: React.PropTypes.object,
  filtersChoices: React.PropTypes.object,
  onChange: React.PropTypes.func,
  style: React.PropTypes.string,
};

const defaultProps = {
  origSelectedValues: {},
  onChange: () => {},
  style: 'input',
};

class CalendarFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValues: props.origSelectedValues,
    };
  }
  changeFilter(filter, options) {
    let vals = null;
    if (options) {
      if (Array.isArray(options)) {
        vals = options.map((opt) => opt.value);
      } else {
        vals = options.value;
      }
    }
    const selectedValues = Object.assign({}, this.state.selectedValues);
    selectedValues[filter] = vals;
    this.setState({ selectedValues });
    this.props.onChange(filter, vals);
  }

  handleChange(filter, e) {
    console.log('e.target.value: ' + e.target.value);
    const clickedValue = e.target.value;
    const selectedValues = Object.assign({}, this.state.selectedValues);
    let vars = [];
    vars.push(clickedValue);
    console.log('vals' + JSON.stringify(vars));
    selectedValues[filter] = vars;
    this.setState({ selectedValues });
    this.props.onChange(filter, vars);
  }

  componentDidUpdate() {
    this.componentDidMount();
  }

  componentDidMount() {
    console.log('execute componentDidMount...');
    let options = {
      language: 'zh-CN',
      todayHighlight: true,
      // changeDate: handleChangeDate,
    };
    console.log('this.props.style : ' + this.props.style);
    if (this.props.style == 'date-range'){
      $('.input-daterange input').each(function() {
        $(this).datepicker(options);
      })
    } else {
      $('#datepicker').datepicker(options).on('changeDate', function(e){
        console.log('e.date...' + e.date);
        $("input[name='__from']").val(e.date);
        $("input[name='__to']").val(e.date);
      });
    }
  }

  render() {
    let html = "";
    if (this.props.style == 'date-range'){
      html = (<div className="input-group input-daterange">
              <input name = "__from" type="text" className="form-control" onChange={this.handleChange.bind(this, '__from')}/>
              <span className="input-group-addon">to</span>
              <input name = "__to" type="text" className="form-control" onChange={this.handleChange.bind(this, '__to')}/>
          </div>);
    } else {
      html = (<div>
      <div id="datepicker" data-date="12/03/2012"></div>
      <input type="hidden" name="__from" onChange={this.handleChange.bind(this, '__from')}/>
      <input type="hidden" name="__to" onChange={this.handleChange.bind(this, '__to')}/>
      </div>);
    }

    return (
      <div>
      {html}
      </div>
    );
  }
}

CalendarFilter.propTypes = propTypes;
CalendarFilter.defaultProps = defaultProps;

function filterBox(slice) {
  const refresh = function () {
    const url = slice.jsonEndpoint({ extraFilters: false });
    $.getJSON(url, (payload) => {
      const fd = payload.form_data;
      const filtersChoices = {};
      ReactDOM.render(
        <CalendarFilter
          filtersChoices={filtersChoices}
          onChange={slice.setFilter}
          style={fd.calendar_style}
          origSelectedValues={slice.getFilters() || {}}
        />,
        document.getElementById(slice.containerId)
      );
      slice.done(payload);
    })
    .fail(function (xhr) {
      slice.error(xhr.responseText, xhr);
    });
  };
  return {
    render: refresh,
    resize: () => {},
  };
}

module.exports = filterBox;

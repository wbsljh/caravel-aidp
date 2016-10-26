// const $, jQuery = require('jquery');
window.jQuery = window.$ = require('jquery');
require('jquery-ui');
// require('../node_modules/bootstrap/dist/js/bootstrap.js');
// require('../node_modules/bootstrap/dist/css/bootstrap.min.css');
require('bootstrap-datepicker');
require('../node_modules/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN.js');
require('../node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css');
require('../node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker3.standalone.css');

function calendarWidget(slice) {

  function handleChangeDate(e) {
    console.log(e.date);
  }

  function getRawHtml(container, style) {

    const time_field = ['__from', '__to'];
    let options = {
      language: 'zh-CN',
      todayHighlight: true,
      changeDate: handleChangeDate,
    };

    let html = '';
    if (style == 'input') {
      html = '<input id="datepicker" type="text">';
      container.html(html);
      $('#datepicker').datepicker(options)
      .on('changeDate', function() {
        ['__from', '__to'].map((field) => {
          const val = this.state.selectedValues[field];
          const choices = TIME_CHOICES.slice();
          if (!choices.includes(val)) {
            choices.push(val);
          }
        });
      });

    } else if (style == 'component') {
      html += '<div class="input-group date">';
      html += '  <input type="text" class="form-control" id="datepicker">';
      html += '  <div class="input-group-addon">';
      html += '      <span class="glyphicon glyphicon-th"></span>';
      html += '  </div>';
      html += '</div>';

      container.html(html);
      $('#datepicker').datepicker(options);
    } else if (style == 'date-range'){
      html += '<div class="input-group input-daterange">';
      html += ' <input type="text" class="form-control">';
      html += ' <span class="input-group-addon">to</span>';
      html += ' <input type="text" class="form-control">';
      html += '</div>';
      container.html(html);

      $('.input-daterange input').each(function() {
          $(this).datepicker(options);
      });
    } else if (style == 'inline') {
      html += '<div id="datepicker"></div>';
      html += '<input type="hidden" id="my_hidden_input">';
      container.html(html);

      $('#datepicker').datepicker();
      $('#datepicker').on("changeDate", function() {
          $('#my_hidden_input').val(
              $('#datepicker').datepicker(options)
          );
      });
    }
  }

  function refresh() {
    console.log(slice.jsonEndpoint());
    $.getJSON(slice.jsonEndpoint(), function (payload) {
      const fd = payload.form_data;
      console.log('start...' + fd.calendar_style);
      getRawHtml(slice.container, fd.calendar_style);
      // console.log('html' + html);
      // slice.container.html(html);
      // $('#datepicker').datepicker();
      slice.done(payload);
    })
      .fail(function (xhr) {
        slice.error(xhr.responseText, xhr);
      });
  }
  return {
    render: refresh,
    resize: refresh,
  };
}

module.exports = calendarWidget;

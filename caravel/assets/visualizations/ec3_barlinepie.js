const $ = require('jquery');
const echarts = require('echarts');

function Ec3BarLineWidget(slice) {

  function getDefaultOptions(vizType) {
    let chart_options = {};
    switch (vizType) {
      case 'ec3_barline':
        chart_options = {
          xAxis: [{
            type: 'category'
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
            type: 'bar'
          }]
        };
        break;
      case 'ec3_pie':
        chart_options = {
          legend: {},
          series: [{
            type: 'pie'
          }]
        };
        break;
      case 'ec3_map':
        chart_options = {
          xAxis: [{
            type: 'category'
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
            type: 'bar'
          }]
        };
        break;

    }
    return chart_options;
  }

  function getSymbolRotate(direction){
    switch (direction) {
      case 'n':
        return 0;
      case 'e':
        return 90;
      case 's':
        return 180;
      case 'w':
        return 270;
    }
  }

  function getOptions(payload) {
    // get init echart_options
    let fd = payload.form_data;
    let chart_options = {};
    if (fd.options == '') {
      chart_options = getDefaultOptions(fd.viz_type);
    } else if (fd.viz_type != 'ec3_map') {
      chart_options = eval('(' + fd.options + ')');
      if (!('xAxis' in chart_options)){
        chart_options.xAxis = [{type: 'category'}];
      }
      if (!('yAxis' in chart_options)){
        chart_options.yAxis = [{type: 'value'}];
      }
 
    }
    //add data to echart_options
    let legend_data = [];
    let xaxis_data = [];

    let dimension = "";
    //TODO support multi dimension
    if ('dimensions' in fd && fd.dimensions != null && fd.dimensions.length > 0) {
      dimension = fd.dimensions[0];
    }

    let metrics = fd.metrics;

    //init data
    payload.data.records.forEach((d) => {
      // legend_data.push(d[dimension]);
      xaxis_data.push(d[dimension]);
    });

    //get default_serie
    let default_serie = {};
    if (chart_options.series.length == 1) {
      default_serie = chart_options.series[0];
    }
    //init series data
    if (chart_options.series.length <= 1) {
      for (let i = 0; i < metrics.length; i++) {
        let metric = metrics[i];
        // if there is only one serie
        let serie = default_serie;
        if (!('name' in serie)) {
          serie.name = metric;
        }
        // add legend
        legend_data.push(metric);

        let serie_data = []
        payload.data.records.forEach((d) => {
          let name = d[dimension];
          let value = d[metric];
          let _item = {
            name,
            value
          };

          // add wind direction
          if (fd.ec3_wind_direction != null) {
            _item['symbol'] = 'arrow';
            _item['symbolRotate'] = getSymbolRotate(d[fd.ec3_wind_direction]);
          }

          serie_data.push(_item);
        });

        serie.data = serie_data
        chart_options.series[i] = serie;
      }
    } else {
      // when series length larger than one
      for (let i = 0; i < chart_options.series.length; i++) {
        let metric = metrics[i]
        let serie_data = [];

        legend_data.push(metric);
        
        if (!('name' in chart_options.series[i])) {
          chart_options.series[i].name = metric;
        }
        //if chart_options.series have not set the data
        if (!('data' in chart_options.series[i] && chart_options.series[i].data.length > 0)) {
          payload.data.records.forEach((d) => {
            const name = d[dimension];
            const value = d[metric];
            let _item = {
              name,
              value
            };
            // add wind direction
            if (fd.ec3_wind_direction != null) {
              _item['symbol'] = 'arrow';
              _item['symbolRotate'] = getSymbolRotate(d[fd.ec3_wind_direction]);
            }
            serie_data.push(_item);
          });
          chart_options.series[i].data = serie_data;
        }
      };
    }

    if ('legend' in chart_options) {
      if (!('data' in chart_options.legend && chart_options.legend.data.length > 0)) {
        chart_options.legend.data = legend_data;
      }
    }

    if ('xAxis' in chart_options) {
      //TODO consider more than one
      if (!('data' in chart_options.xAxis[0] && chart_options.xAxis[0].data > 0)) {
        chart_options.xAxis[0].data = xaxis_data;
      }
    }

    console.log('chart_options: \n' + JSON.stringify(chart_options));
    return chart_options;
  }

  function refresh() {
    $.getJSON(slice.jsonEndpoint(), function(payload) {
        let chart_options = getOptions(payload);
        let chart = echarts.init(document.getElementById(slice.containerId));
        chart.setOption(chart_options);
        slice.done(payload);
      })
      .fail(function(xhr) {
        slice.error(xhr.responseText, xhr);
      });
  }
  return {
    getOptions,
    render: refresh,
    resize: refresh,
  };
}

module.exports = Ec3BarLineWidget;
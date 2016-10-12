const $ = require('jquery');
//const echarts = require('echarts');
require('../node_modules/echarts-2.2.7/dist/echarts-all.js');

function Ec3MapWidget(slice) {
  function refresh() {
    $.getJSON(slice.jsonEndpoint(), function(payload) {
        // get chart_options properties
        let _option_str = payload.form_data.options;
        console.log(payload.form_data.options);
        let chart_options = eval('(' + _option_str + ')');
        let legend_data = [];
        let xaxis_data = [];

        //
        let groupby = "";
        if ('groupby' in payload.form_data && payload.form_data.groupby != null && payload.form_data.groupby.length > 0){
          groupby = payload.form_data.groupby[0];
        }
        let all_columns = payload.form_data.all_columns
        let metrics = payload.form_data.metrics
        if (all_columns != null && all_columns.length > 0) {
          groupby = all_columns[0];
          metrics = all_columns;
          metrics.splice(0, 1)
        }

        payload.data.records.forEach((d) => {
          legend_data.push(d[groupby]);
          xaxis_data.push(d[groupby]);
        });

        for (let i = 0; i < chart_options.series.length; i++) {
          let metric = metrics[i]
          let serie_data = [];
          
          console.log('serie ' + i + serie_data);
          if (!('name' in chart_options.series[i])){
            chart_options.series[i].name = metric;
          }
          //if chart_options.series have not set the data
          if (!('data' in chart_options.series[i] && chart_options.series[i].data.length > 0)){
            payload.data.records.forEach((d) => {
              const name = d[groupby];
              const value = d[metric];
              let _item = {
                name,
                value
              };
              serie_data.push(_item);
            });
            chart_options.series[i].data = serie_data;
          }
        };

        if ('legend' in chart_options) {
          if (!('data' in chart_options.legend &&chart_options.legend.data.length > 0)) {
              chart_options.legend.data = legend_data;
          } 
        }

        if ('xAxis' in chart_options) {
          //TODO consider more than one
          if (!('data' in chart_options.xAxis[0] && chart_options.xAxis[0].data > 0)){
            chart_options.xAxis[0].data = xaxis_data;
          }
        }

        console.log('chart_options: \n' + JSON.stringify(chart_options));
        console.log('payload: \n' + JSON.stringify(payload.form_data));
        //regist the custom map type
        if (payload.form_data.custom_map != ''){
          console.log('enter to regist echart map type....');
          echarts.util.mapData.params.params.custom = {
            getGeoJson: function(callback) {
              $.ajax({
                url: payload.form_data.custom_map_url, 
                dataType: 'xml',
                type: "get",
                success: function(xml) {
                  callback(xml);
                }
              });
            }
          };
        }

        let chart = echarts.init(document.getElementById(slice.containerId));
        chart.setOption(chart_options);

        /*$.get(payload.form_data.custom_map_url, function (customMapData) {
            console.log('registerMap:' + payload.form_data.custom_map + '\n data:' + customMapData)
            echarts.registerMap(payload.form_data.custom_map, customMapData);
            let chart = echarts.init(document.getElementById(slice.containerId));
            chart.setOption(chart_options);
        });

        $.ajax({
               url: payload.form_data.custom_map_url, //"",
               dataType: 'xml',
               type: "get",
               success: function(customMapData) {  
                  console.log('registerMap:' + payload.form_data.custom_map + '\n data:' + customMapData)
                  echarts.registerMap(payload.form_data.custom_map, customMapData);
                  let chart = echarts.init(document.getElementById(slice.containerId));
                  chart.setOption(chart_options);                                     
               }
        });*/


        /*$.get(payload.form_data.custom_map_url, function (customMapData) {
            console.log('registerMap:' + payload.form_data.custom_map + '\n data:' + customMapData)
            echarts.registerMap(payload.form_data.custom_map, customMapData);
            let chart = echarts.init(document.getElementById(slice.containerId));
            chart.setOption(chart_options);
        });    */

        //chart.setOption(chart_options);
        //slice.container.html(payload.form_data.options);
        slice.done(payload);
      })
      .fail(function(xhr) {
        slice.error(xhr.responseText, xhr);
      });
  }
  return {
    render: refresh,
    resize: refresh,
  };
}

module.exports = Ec3MapWidget;
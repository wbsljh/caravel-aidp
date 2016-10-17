const $ = require('jquery');
//const echarts = require('echarts');
require('../node_modules/echarts-2.2.7/dist/echarts-all.js');
const ec3barline = require('./ec3_barlinepie.js')

function Ec3MapWidget(slice) {
  function refresh() {
    $.getJSON(slice.jsonEndpoint(), function(payload) {
        let chart_options = ec3barline(slice).getOptions(payload)
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
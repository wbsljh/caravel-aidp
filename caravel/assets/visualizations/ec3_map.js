const $ = require('jquery');
//const echarts = require('echarts');
require('../node_modules/echarts-2.2.7/dist/echarts-all.js');
const ec3barline = require('./ec3_barlinepie.js')

function Ec3MapWidget(slice) {
  function refresh() {
    $.getJSON(slice.jsonEndpoint(), function(payload) {
        let chart_options = ec3barline(slice).getOptions(payload)
        //regist the custom map type
        var ec3_map_type = payload.form_data.aiec3_map_type||'svg';
        var ec3_map_name = payload.form_data.aiec3_map_type_name||'customMapName';
        if (ec3_map_type === 'svg'){
          console.log('enter SVG....');
          echarts.util.mapData.params.params[ec3_map_name] = {
            getGeoJson: function(callback) {
              $.ajax({
                url: payload.form_data.aiec3_map_file, 
                dataType: 'xml',
                type: "get",
                success: function(xml) {
                  callback(xml);
                }
              });
            }
          };
        }else if (ec3_map_type === 'json'){
          console.log('enter JSON....,ec3_map_type:'+ec3_map_type
            +",ec3_map_name:"+ec3_map_name);
          echarts.util.mapData.params.params[ec3_map_name] = {
            getGeoJson: function(callback) {
              $.getJSON(payload.form_data.aiec3_map_file,callback);
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
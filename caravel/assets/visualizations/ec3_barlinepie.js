const $ = require('jquery');
const echarts = require('echarts');

function Ec3BarLinePieWidget(slice) {
  function refresh() {
    $('#code').attr('rows', '15');
    $.getJSON(slice.jsonEndpoint(), function(payload) {
        // 基于准备好的dom，初始化echarts实例
        let chart = echarts.init(document.getElementById(slice.containerId));
        // 绘制图表
        //slice.container.html(JSON.parse('{}));
        //let chart_options = {title:{text:'ECharts 入门示例'},tooltip:{},xAxis:{data:["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]},yAxis:{},series:[{name:'销量',type:'bar',data:[5,20,36,10,10,20]}]};
        //let _option_str = {title:{text:"ECharts 入门示例"},tooltip:{},legend:{data:["销量"]},xAxis:{data:["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]},yAxis:{},series:[{name:"销量",type:"bar",data:[5,20,36,10,10,20]}]}';
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
          console.log('before splice :' + metrics);
          metrics.splice(0, 1)
          console.log('after splice :' + metrics);
        }

        payload.data.records.forEach((d) => {
          legend_data.push(d[groupby]);
          xaxis_data.push(d[groupby]);
        });

        for (let i = 0; i < chart_options.series.length; i++) {
          let metric = metrics[i]
          let serie_data = [];

          console.log('serie ' + i + serie_data);
          if (!('name' in chart_options.series[i])) {
            chart_options.series[i].name = metric;
          }
          //if chart_options.series have not set the data
          if (!('data' in chart_options.series[i] && chart_options.series[i].data.length > 0)) {
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
        chart.setOption(chart_options);
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

module.exports = Ec3BarLinePieWidget;
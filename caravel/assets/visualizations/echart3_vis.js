const $ = require('jquery');
const echarts = require('echarts');

function echartWidget(slice) {
  function refresh() {
    $('#code').attr('rows', '15');
    $.getJSON(slice.jsonEndpoint(), function (payload) {
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
      let serie_data = [];
      
      let groupby  = payload.form_data.groupby[0]
      
      payload.data.records.forEach((d) => {
            const name = d[groupby];
            legend_data.push(name);
      });

      for (let i = 0; i < chart_options.series.length; i++) {
          let metric = payload.form_data.metrics[i]
          payload.data.records.forEach((d) => {
              const name = d[groupby];
              const value = d[metric];
              let _item = {name, value};
              serie_data.push(_item);
          });
          console.log('serie ' + i + serie_data);
          chart_options.series[i].data = serie_data;
      };
      console.log('legend' in chart_options);
      if ('legend' in chart_options){
        chart_options.legend.data = legend_data;
      }
      
      if ('xAxis' in chart_options) {
        //TODO consider more than one
        chart_options.xAxis[0].data = legend_data;
      }

      console.log('chart_options: \n' + JSON.stringify(chart_options));
      chart.setOption(chart_options);
      //slice.container.html(payload.form_data.options);
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

module.exports = echartWidget;

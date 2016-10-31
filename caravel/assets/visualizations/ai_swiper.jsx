const $ = require('jquery');

import ReactDOM from 'react-dom';

import '../javascripts/jsframe/swiper-3.4.0/swiper.min.js';

import '../javascripts/jsframe/swiper-3.4.0/swiper.min.css';

import './ai_swiper.css';

var React = require('react');

var AiSwiper = React.createClass({

  render: function() {

    const naviBtnHtml = (
      <div>
        <div className="swiper-button-prev">
        </div>
        <div className="swiper-button-next">
        </div>
      </div>
    );

    return (
      <div id={this.props.swpConId} className="swiper-container">
        <style>
          {this.props.swpStyle}
        </style>
        <div className="swiper-wrapper">
        {
          this.props.sliders.map((slider) => {
            return <div className="swiper-slide">{slider.name}</div>
          })
        }
        </div>
        {
          (()=>{
            if (this.props.pagination)
              return <div className="swiper-pagination"></div>
          })()         
        }
        {(()=>{
            if (this.props.naviBtn)
              return naviBtnHtml
          })()}
      </div>
    );
  }


});

function aiSwiperWidget(slice) {
  function refresh() {
    document.getElementById(slice.containerId).innerHTML='';
    $.getJSON(slice.jsonEndpoint(), (payload) => {
      ReactDOM.render(
        <AiSwiper
          swpConId={'mySwp_'+payload.form_data.slice_id} 
          sliders={payload.data.records}
          pagination={payload.form_data.aiswpier_pagination}
          direction={payload.form_data.aiswpier_direction}
          naviBtn={payload.form_data.aiswpier_navi}
          swpStyle={payload.form_data.slice_cus_css}
        />,
        document.getElementById(slice.containerId)
      );
      let fd = payload.form_data;
      let mySwpCon = '#mySwp_'+fd.slice_id;
      let mySwiper = {};
      let myswpOpt = {};
      if(fd.aiswpier_pagination){
        myswpOpt.pagination = '.swiper-pagination';
        myswpOpt.paginationClickable = true;
      }
      if(fd.aiswpier_direction){
        myswpOpt.direction = fd.aiswpier_direction+'';
      }
      if(fd.aiswpier_navi){
        myswpOpt.nextButton = '.swiper-button-next';
        myswpOpt.prevButton = '.swiper-button-prev';
      }
      mySwiper = new Swiper (mySwpCon,myswpOpt);
      
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

module.exports = aiSwiperWidget;


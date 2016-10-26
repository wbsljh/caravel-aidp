const $ = require('jquery');

import ReactDOM from 'react-dom';

import '../javascripts/jsframe/swiper-3.4.0/swiper.min.js';

import '../javascripts/jsframe/swiper-3.4.0/swiper.min.css';

import './ai_swiper.css';

var React = require('react');

var AiSwiper = React.createClass({

  render: function() {
    return (
      <div id={this.props.swpConId} className="swiper-container">
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
      </div>
    );
  }


});

function aiSwiperWidget(slice) {
  function refresh() {
    $.getJSON(slice.jsonEndpoint(), (payload) => {
      ReactDOM.render(
        <AiSwiper
          swpConId={'mySwp_'+payload.form_data.slice_id} 
          sliders={payload.data.records}
          pagination={payload.form_data.aiswpier_pagination}
          direction={payload.form_data.aiswpier_direction}
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


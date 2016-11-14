const $ = window.$ = require('jquery');
const jQuery = window.jQuery = require('jquery'); // eslint-disable-line
const px = require('../modules/superset');
const d3 = require('d3');
const urlLib = require('url');
const utils = require('../modules/utils');

import React from 'react';
import { render } from 'react-dom';
import GridLayout from './components/GridLayout';
import Header from './components/Header';

require('bootstrap');
require('../../stylesheets/dashboard.css');
require('../superset-select2.js');

export function getInitialState(dashboardData, context) {
  const dashboard = Object.assign({ context }, utils.controllerInterface, dashboardData);
  dashboard.firstLoad = true;

  dashboard.posDict = {};
  if (dashboard.position_json) {
    dashboard.position_json.forEach(position => {
      dashboard.posDict[position.slice_id] = position;
    });
  }
  dashboard.curUserId = dashboard.context.user_id;
  dashboard.refreshTimer = null;

  const state = {
    dashboard,
  };
  return state;
}

function initDashboardView(dashboard) {
  render(
    <Header dashboard={dashboard} />,
    document.getElementById('dashboard-header')
  );
  // eslint-disable-next-line no-param-reassign
  dashboard.reactGridLayout = render(
    <GridLayout dashboard={dashboard} isResizable={!readonly}/>,
    document.getElementById('grid-container')
  );

  // Displaying widget controls on hover
  $('.react-grid-item').hover(
    function () {
      $(this).find('.chart-controls').fadeIn(300);
    },
    function () {
      $(this).find('.chart-controls').fadeOut(300);
    }
  );
  $('div.grid-container').css('visibility', 'visible');

  $('.select2').select2({
    dropdownAutoWidth: true,
  });
  $('div.widget').click(function (e) {
    const $this = $(this);
    const $target = $(e.target);

    if ($target.hasClass('slice_info')) {
      $this.find('.slice_description').slideToggle(0, function () {
        $this.find('.refresh').click();
      });
    } else if ($target.hasClass('controls-toggle')) {
      $this.find('.chart-controls').toggle();
    }
  });
  px.initFavStars();
  $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
}

function dashboardContainer(dashboard, urlParams, readonly) {
  return Object.assign({}, dashboard, {
    type: 'dashboard',
    filters: {},
    init() {
      this.sliceObjects = [];
      dashboard.slices.forEach((data) => {
        if (data.error) {
          const html = '<div class="alert alert-danger">' + data.error + '</div>';
          $('#slice_' + data.slice_id).find('.token').html(html);
        } else {
          const slice = px.Slice(data, this);
          $('#slice_' + data.slice_id).find('a.refresh').click(() => {
            slice.render(true);
          });
          this.sliceObjects.push(slice);
        }
      });
      this.loadPreSelectFilters();
      this.startPeriodicRender(0);
      this.bindResizeToWindowResize();
    },
    loadPreSelectFilters() {
      //set globe params,which sliceid was fixed to 0
      for (const param in urlParams){
        //'preselect_filters' exluded for been used in filter_box 
        if(param&&param!=='preselect_filters'){
          this.setFilter(0, param, urlParams[param], false, false);
        }        
      }

      try {
        const filters = JSON.parse(px.getParam('preselect_filters') || '{}');
        for (const sliceId in filters) {
          for (const col in filters[sliceId]) {
            this.setFilter(sliceId, col, filters[sliceId][col], false, false);
          }
        }
      } catch (e) {
        // console.error(e);
      }
    },
    setFilter(sliceId, col, vals, refresh) {
      this.addFilter(sliceId, col, vals, false, refresh);
    },
    done(slice) {
      const refresh = slice.getWidgetHeader().find('.refresh');
      const data = slice.data;
      if (data !== undefined && data.is_cached) {
        refresh
        .addClass('danger')
        .attr('title',
              'Served from data cached at ' + data.cached_dttm +
                '. Click to force refresh')
                .tooltip('fixTitle');
      } else {
        refresh
        .removeClass('danger')
        .attr('title', 'Click to force refresh')
        .tooltip('fixTitle');
      }
    },
    effectiveExtraFilters(sliceId) {
      // Summarized filter, not defined by sliceId
      // returns k=field, v=array of values
      const f = {};
      const immuneSlices = this.metadata.filter_immune_slices || [];
      if (sliceId && immuneSlices.includes(sliceId)) {
        // The slice is immune to dashboard fiterls
        return f;
      }

      // Building a list of fields the slice is immune to filters on
      let immuneToFields = [];
      if (
            sliceId &&
            this.metadata.filter_immune_slice_fields &&
            this.metadata.filter_immune_slice_fields[sliceId]) {
        immuneToFields = this.metadata.filter_immune_slice_fields[sliceId];
      }
      for (const filteringSliceId in this.filters) {
        for (const field in this.filters[filteringSliceId]) {
          if (!immuneToFields.includes(field)) {
            f[field] = this.filters[filteringSliceId][field];
          }
        }
      }
      return f;
    },
    addFilter(sliceId, col, vals, merge = true, refresh = true) {
      if (!(sliceId in this.filters)) {
        this.filters[sliceId] = {};
      }
      if (!(col in this.filters[sliceId]) || !merge) {
        this.filters[sliceId][col] = vals;
      } else {
        this.filters[sliceId][col] = d3.merge([this.filters[sliceId][col], vals]);
      }
      if (refresh) {
        this.refreshExcept(sliceId);
      }
      this.updateFilterParamsInUrl();
    },
    readFilters() {
      // Returns a list of human readable active filters
      return JSON.stringify(this.filters, null, '  ');
    },
    updateFilterParamsInUrl() {
      const urlObj = urlLib.parse(location.href, true);
      urlObj.query = urlObj.query || {};
      urlObj.query.preselect_filters = this.readFilters();
      urlObj.search = null;
      history.pushState(urlObj.query, window.title, urlLib.format(urlObj));
    },
    bindResizeToWindowResize() {
      let resizeTimer;
      const dash = this;
      $(window).on('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          dash.sliceObjects.forEach((slice) => {
            slice.resize();
          });
        }, 500);
      });
    },
    stopPeriodicRender() {
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
        this.refreshTimer = null;
      }
    },
    startPeriodicRender(interval) {
      this.stopPeriodicRender();
      const dash = this;
      const maxRandomDelay = Math.max(interval * 0.2, 5000);
      const refreshAll = () => {
        dash.sliceObjects.forEach(slice => {
          const force = !dash.firstLoad;
          setTimeout(() => {
            slice.render(force);
          },
          // Randomize to prevent all widgets refreshing at the same time
          maxRandomDelay * Math.random());
        });
        dash.firstLoad = false;
      };

      const fetchAndRender = function () {
        refreshAll();
        if (interval > 0) {
          dash.refreshTimer = setTimeout(function () {
            fetchAndRender();
          }, interval);
        }
      };
      fetchAndRender();
    },
    refreshExcept(sliceId) {
      const immune = this.metadata.filter_immune_slices || [];
      this.sliceObjects.forEach(slice => {
        if (slice.data.slice_id !== sliceId && immune.indexOf(slice.data.slice_id) === -1) {
          slice.render();
          const sliceSeletor = $(`#${slice.data.token}-cell`);
          sliceSeletor.addClass('slice-cell-highlight');
          setTimeout(function () {
            sliceSeletor.removeClass('slice-cell-highlight');
          }, 1200);
        }
      });
    },
    clearFilters(sliceId) {
      delete this.filters[sliceId];
      this.refreshExcept(sliceId);
      this.updateFilterParamsInUrl();
    },
    removeFilter(sliceId, col, vals) {
      if (sliceId in this.filters) {
        if (col in this.filters[sliceId]) {
          const a = [];
          this.filters[sliceId][col].forEach(function (v) {
            if (vals.indexOf(v) < 0) {
              a.push(v);
            }
          });
          this.filters[sliceId][col] = a;
        }
      }
      this.refreshExcept(sliceId);
      this.updateFilterParamsInUrl();
    },
    getSlice(sliceId) {
      const id = parseInt(sliceId, 10);
      let i = 0;
      let slice = null;
      while (i < this.sliceObjects.length) {
        // when the slice is found, assign to slice and break;
        if (this.sliceObjects[i].data.slice_id === id) {
          slice = this.sliceObjects[i];
          break;
        }
        i++;
      }
      return slice;
    },
    getAjaxErrorMsg(error) {
      const respJSON = error.responseJSON;
      return (respJSON && respJSON.message) ? respJSON.message :
              error.responseText;
    },
    addSlicesToDashboard(sliceIds) {
      const getAjaxErrorMsg = this.getAjaxErrorMsg;
      $.ajax({
        type: 'POST',
        url: `/superset/add_slices/${dashboard.id}/`,
        data: {
          data: JSON.stringify({ slice_ids: sliceIds }),
        },
        success() {
          // Refresh page to allow for slices to re-render
          window.location.reload();
        },
        error(error) {
          const errorMsg = getAjaxErrorMsg(error);
          utils.showModal({
            title: 'Error',
            body: 'Sorry, there was an error adding slices to this dashboard: </ br>' + errorMsg,
          });
        },
      });
    },
  });
}

$(document).ready(() => {
  // Getting bootstrapped data from the DOM
  const dashboardData = $('.dashboard').data('dashboard');
  const contextData = $('.dashboard').data('context');
  //add by aidp
  const urlparams = $('.dashboard').data('urlparams');
  const readonly = $('.dashboard').data('readonly');

  const state = getInitialState(dashboardData, contextData, urlparams, readonly);
  // const dashboard = dashboardContainer(state.dashboard);
  // add two param by aidp
  const dashboard = dashboardContainer(state.dashboard, state.urlParams, state.readonly);
  initDashboardView(dashboard);
  dashboard.init();
});

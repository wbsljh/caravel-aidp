/* eslint camelcase: 0 */
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/exploreActions';
import { connect } from 'react-redux';
import { Panel } from 'react-bootstrap';
import { visTypes, commonControlPanelSections } from '../stores/store';
import ControlPanelSection from './ControlPanelSection';
import FieldSetRow from './FieldSetRow';

const propTypes = {
  datasource_id: PropTypes.number.isRequired,
  datasource_type: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  isDatasourceMetaLoading: PropTypes.bool.isRequired,
  form_data: PropTypes.object.isRequired,
  y_axis_zero: PropTypes.any,
};

class ControlPanelsContainer extends React.Component {
  componentWillMount() {
    const { datasource_id, datasource_type } = this.props;
    if (datasource_id) {
      this.props.actions.fetchFieldOptions(datasource_id, datasource_type);
    }
  }

  onChange(name, value) {
    this.props.actions.setFieldValue(name, value);
  }

  sectionsToRender() {
    const viz = visTypes[this.props.form_data.viz_type];
    const { datasourceAndVizType, sqlClause } = commonControlPanelSections;
    const sectionsToRender = [datasourceAndVizType].concat(viz.controlPanelSections, sqlClause);

    return sectionsToRender;
  }

  fieldOverrides() {
    const viz = visTypes[this.props.form_data.viz_type];
    return viz.fieldOverrides;
  }

  render() {
    return (
      <Panel>
        {!this.props.isDatasourceMetaLoading &&
          <div className="scrollbar-container">
            <div className="scrollbar-content">
              {this.sectionsToRender().map((section) => (
                <ControlPanelSection
                  key={section.label}
                  label={section.label}
                  tooltip={section.description}
                >
                  {section.fieldSetRows.map((fieldSets, i) => (
                    <FieldSetRow
                      key={`${section.label}-fieldSetRow-${i}`}
                      fieldSets={fieldSets}
                      fieldOverrides={this.fieldOverrides()}
                      onChange={this.onChange.bind(this)}
                      fields={this.props.fields}
                      form_data={this.props.form_data}
                    />
                  ))}
                </ControlPanelSection>
              ))}
              {/* TODO: add filters section */}
            </div>
          </div>
        }
      </Panel>
    );
  }
}

ControlPanelsContainer.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isDatasourceMetaLoading: state.isDatasourceMetaLoading,
    fields: state.fields,
    datasource_id: state.datasource_id,
    datasource_type: state.datasource_type,
    form_data: state.viz.form_data,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export { ControlPanelsContainer };

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanelsContainer);

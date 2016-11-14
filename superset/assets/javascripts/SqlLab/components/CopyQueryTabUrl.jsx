import React from 'react';
import CopyToClipboard from '../../components/CopyToClipboard';
import { getShortUrl } from '../../../utils/common';

const propTypes = {
  queryEditor: React.PropTypes.object.isRequired,
};

export default class CopyQueryTabUrl extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      shortUrl: '',
    };
  }

  componentWillMount() {
    const qe = this.props.queryEditor;
    const params = [];
    if (qe.dbId) params.push('dbid=' + qe.dbId);
    if (qe.title) params.push('title=' + encodeURIComponent(qe.title));
    if (qe.schema) params.push('schema=' + encodeURIComponent(qe.schema));
    if (qe.autorun) params.push('autorun=' + qe.autorun);
    if (qe.sql) params.push('sql=' + encodeURIComponent(qe.sql));

    const queryString = params.join('&');
    const queryLink = window.location.pathname + '?' + queryString;
    getShortUrl(queryLink, this.onShortUrlSuccess.bind(this));
  }

  onShortUrlSuccess(data) {
    this.setState({
      shortUrl: data,
    });
  }

  render() {
    return (
      <CopyToClipboard
        inMenu
        text={this.state.shortUrl}
        copyNode={<span>share query</span>}
        tooltipText="copy URL to clipboard"
        shouldShowText={false}
      />
    );
  }
}

CopyQueryTabUrl.propTypes = propTypes;

import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/github';
import 'brace/ext/language_tools';
import ace from 'brace';
import { areArraysShallowEqual } from '../../reduxUtils';

const langTools = ace.acequire('ace/ext/language_tools');

const propTypes = {
  actions: React.PropTypes.object.isRequired,
  onBlur: React.PropTypes.func,
  onAltEnter: React.PropTypes.func,
  sql: React.PropTypes.string.isRequired,
  tables: React.PropTypes.array,
  queryEditor: React.PropTypes.object.isRequired,
};

const defaultProps = {
  onBlur: () => {},
  onAltEnter: () => {},
  tables: [],
};

class AceEditorWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sql: props.sql,
    };
  }
  componentDidMount() {
    // Making sure no text is selected from previous mount
    this.props.actions.queryEditorSetSelectedText(this.props.queryEditor, null);
    this.setAutoCompleter();
  }
  componentWillReceiveProps(nextProps) {
    if (!areArraysShallowEqual(this.props.tables, nextProps.tables)) {
      this.setAutoCompleter();
    }
  }
  textChange(text) {
    this.setState({ sql: text });
  }
  onBlur() {
    this.props.onBlur(this.state.sql);
  }
  getCompletions(aceEditor, session, pos, prefix, callback) {
    callback(null, this.state.words);
  }
  onEditorLoad(editor) {
    editor.commands.addCommand({
      name: 'runQuery',
      bindKey: { win: 'Alt-enter', mac: 'Alt-enter' },
      exec: () => {
        this.props.onAltEnter();
      },
    });
    editor.$blockScrolling = Infinity; // eslint-disable-line no-param-reassign
    editor.selection.on('changeSelection', () => {
      this.props.actions.queryEditorSetSelectedText(
        this.props.queryEditor, editor.getSelectedText());
    });
  }
  setAutoCompleter() {
    // Loading table and column names as auto-completable words
    let words = [];
    const columns = {};
    const tables = this.props.tables || [];
    tables.forEach(t => {
      words.push({ name: t.name, value: t.name, score: 55, meta: 'table' });
      const cols = t.columns || [];
      cols.forEach(col => {
        columns[col.name] = null;  // using an object as a unique set
      });
    });
    words = words.concat(Object.keys(columns).map(col => (
      { name: col, value: col, score: 50, meta: 'column' }
    )));
    this.setState({ words });
    const completer = {
      getCompletions: this.getCompletions.bind(this),
    };
    if (langTools) {
      langTools.setCompleters([completer, langTools.keyWordCompleter]);
    }
  }
  render() {
    return (
      <AceEditor
        mode="sql"
        theme="github"
        onLoad={this.onEditorLoad.bind(this)}
        onBlur={this.onBlur.bind(this)}
        minLines={8}
        maxLines={30}
        onChange={this.textChange.bind(this)}
        height="200px"
        width="100%"
        editorProps={{ $blockScrolling: true }}
        enableLiveAutocompletion
        value={this.state.sql}
      />
    );
  }
}
AceEditorWrapper.defaultProps = defaultProps;
AceEditorWrapper.propTypes = propTypes;

export default AceEditorWrapper;

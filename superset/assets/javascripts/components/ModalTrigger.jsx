import React, { PropTypes } from 'react';
import { Modal } from 'react-bootstrap';
import Button from './Button';
import cx from 'classnames';

const propTypes = {
  triggerNode: PropTypes.node.isRequired,
  modalTitle: PropTypes.node.isRequired,
  modalBody: PropTypes.node,  // not required because it can be generated by beforeOpen
  beforeOpen: PropTypes.func,
  onExit: PropTypes.func,
  isButton: PropTypes.bool,
  bsSize: PropTypes.string,
  className: PropTypes.string,
  tooltip: PropTypes.string,
};

const defaultProps = {
  beforeOpen: () => {},
  onExit: () => {},
  isButton: false,
  bsSize: null,
  className: '',
};

export default class ModalTrigger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  close() {
    this.setState({ showModal: false });
  }

  open(e) {
    e.preventDefault();
    this.props.beforeOpen();
    this.setState({ showModal: true });
  }
  renderModal() {
    return (
      <Modal
        show={this.state.showModal}
        onHide={this.close}
        onExit={this.props.onExit}
        bsSize={this.props.bsSize}
        className={this.props.className}
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.props.modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.modalBody}
        </Modal.Body>
      </Modal>
    );
  }

  render() {
    const classNames = cx({
      'btn btn-default btn-sm': this.props.isButton,
    });
    if (this.props.isButton) {
      return (
        <Button tooltip={this.props.tooltip} onClick={this.open}>
          {this.props.triggerNode}
          {this.renderModal()}
        </Button>
      );
    }
    return (
      <span className={classNames} onClick={this.open} role="button">
        {this.props.triggerNode}
        {this.renderModal()}
      </span>
    );
  }
}

ModalTrigger.propTypes = propTypes;
ModalTrigger.defaultProps = defaultProps;

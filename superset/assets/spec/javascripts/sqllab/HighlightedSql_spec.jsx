import React from 'react';
import HighlightedSql from '../../../javascripts/SqlLab/components/HighlightedSql';
import ModalTrigger from '../../../javascripts/components/ModalTrigger';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { mount, shallow } from 'enzyme';
import { describe, it } from 'mocha';
import { expect } from 'chai';


describe('HighlightedSql', () => {
  const sql = "SELECT * FROM test WHERE something='fkldasjfklajdslfkjadlskfjkldasjfkladsjfkdjsa'";
  it('renders with props', () => {
    expect(React.isValidElement(<HighlightedSql sql={sql} />))
    .to.equal(true);
  });
  it('renders a ModalTrigger', () => {
    const wrapper = shallow(<HighlightedSql sql={sql} />);
    expect(wrapper.find(ModalTrigger)).to.have.length(1);
  });
  it('renders a ModalTrigger while using shrink', () => {
    const wrapper = shallow(<HighlightedSql sql={sql} shrink maxWidth={20} />);
    expect(wrapper.find(ModalTrigger)).to.have.length(1);
  });
  it('renders two SyntaxHighlighter in modal', () => {
    const wrapper = mount(
      <HighlightedSql sql={sql} rawSql="SELECT * FORM foo" shrink maxWidth={5} />);
    const well = wrapper.find('.well');
    expect(well).to.have.length(1);
    well.simulate('click');
    const modalBody = mount(wrapper.state().modalBody);
    expect(modalBody.find(SyntaxHighlighter)).to.have.length(2);
  });
});

import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import App from './App';

Enzyme.configure({ adapter: new EnzymeAdapter() });

/**
 * Factory function to create a ShallowWrapper for the App component.
 * @function setup
 * @param {object} props - Component props specific to this setup
 * @param {object} state - Initial state for setup
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, state = null) => {
    const wrapper = shallow(<App {...props} />);
    if (state) wrapper.setState(state);
    return wrapper;
}

/**
 * Return ShallowWrapper containing node(s) with the given data-test value.
 * @param {ShallowWrapper} wrapper -Enzyme shallow wrapper to search within 
 * @param {string} val - Value of data-test attribute for search
 * @returns {ShallowWrapper}
 */
const findByTestAttr = (wrapper, val) => {
    return wrapper.find(`[data-test="${val}"]`);
}
test('renders without crashing', () => {
    const wrapper = setup();
    const appComponent = findByTestAttr(wrapper, 'root-tag');
    expect(appComponent.length).toBe(1);
});

test('renders #game section', () => {
    const wrapper = setup();
    const appComponent = findByTestAttr(wrapper, 'game-section');
    // expect(appComponent).toBe(9);
    expect(appComponent.length).toBe(1);
});

// it('renders three <Foo /> components', () => {
//     const wrapper = setup();
//     const appComponent = findByTestAttr(wrapper, 'board-display');    
//     expect(wrapper.find(Foo)).to.have.lengthOf(3);
// });

describe('<App />', () => {
    it('render squares', () => {
        const wrapper = shallow(<App />);
        expect(wrapper.find('#board-display')).;
    });
});
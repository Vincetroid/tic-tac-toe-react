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

// Tests
test('renders root html element', () => {
    const wrapper = setup();
    const element = findByTestAttr(wrapper, 'root-tag');
    expect(element.length).toBe(1);
});

test('renders game-section', () => {
    const wrapper = setup();
    const element = findByTestAttr(wrapper, 'game-section');
    expect(element.length).toBe(1);
});

test('display empty h1 tag at the beginning', () => {
    const wrapper = setup();
    const element = findByTestAttr(wrapper, 'result-h1');
    expect(element.length).toBe(1);
});

test('has winning combinations', () => {
    const winner = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    expect(winner).toContainEqual([3,4,5],[0,1,2],[6,7,8],[1,4,7],[0,3,6],[2,5,8],[2,4,6],[0,4,8]);
});

test('render board', () => {
    const wrapper = setup();
    const element = findByTestAttr(wrapper, 'board-display');    
    expect(element.length).toBe(1);
});

test('render game boxes (canvas elements)', () => {
    const wrapper = shallow(<App />);
    const element = wrapper.find('canvas');
    expect(element.length).toBe(9);
});

test('display new game boton', () => {
    const wrapper = shallow(<App />);
    const element = wrapper.find('boton');
    expect(element.length).not.toBe(1);
});

test('canvas elements are blank', () => {
    const wrapper = setup();

    const elemn = wrapper.find('[style="background-color: rgb(113, 69, 145);"]')

    expect(elemn.length).not.toBe(1);
});

setTimeout(() => {
    test('it is your turn, click it', () => {
        const wrapper = setup();
        const element = wrapper.find('#canvas1');
    
        element.simulate('click');
        wrapper.update();

        const elementUpdated = wrapper.find('[style="background-color: rgb(113, 69, 145);"]')

        expect(elementUpdated.length).toBe(1);
    });
}, 5000);